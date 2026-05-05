<template>
  <div>
    <div v-if="isLoading" class="d-flex justify-content-center pb-3">
      <span>Loading...</span>
    </div>
    <div v-if="errorMessage" class="d-flex justify-content-center pb-3">
      <span>{{ errorMessage }}</span>
    </div>
    <div v-show="!isLoading && !errorMessage">
      <canvas ref="pdfCanvas" class="d-flex justify-content-center pb-3"></canvas>
      <div class="d-flex justify-content-center pb-3">
        <button class="btn btn-primary" @click="downloadPdf">Download PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
})

const pdfCanvas = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const renderPdf = async () => {
  if (!props.pdfUrl) {
    errorMessage.value = 'PDF preview unavailable.'
    isLoading.value = false
    return
  }

  try {
    const loadingTask = pdfjsLib.getDocument(props.pdfUrl)
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const scale = 1.5
    const viewport = page.getViewport({ scale })
    const canvas = pdfCanvas.value

    if (!canvas) {
      throw new Error('Canvas element is not available for PDF rendering.')
    }

    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }

    await page.render(renderContext).promise
  } catch (error) {
    errorMessage.value = 'Unable to load PDF preview.'
    console.error('Error rendering PDF:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(renderPdf)

const downloadPdf = async () => {
  try {
    const response = await fetch(props.pdfUrl)

    if (!response.ok) {
      throw new Error(`Unable to download PDF (status: ${response.status}).`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'tension.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading PDF:', error)
  }
}
</script>
