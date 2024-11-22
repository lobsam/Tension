<template>
  <div>
    <div v-if="isLoading" class="d-flex justify-content-center">
      <span>Loading...</span>
    </div>

    <div else class="d-flex justify-content-center pb-3">
      <canvas ref="pdfCanvas"></canvas>
      <button class="btn btn-primary" @click="downloadPdf">Download PDF</button>
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

onMounted(async () => {
  const loadingTask = pdfjsLib.getDocument(props.pdfUrl)
  const pdf = await loadingTask.promise
  const page = await pdf.getPage(1)

  const scale = 1.2
  const viewport = page.getViewport({ scale })

  const canvas = pdfCanvas.value
  const context = canvas.getContext('2d')
  canvas.height = viewport.height
  canvas.width = viewport.width

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  }

  await page.render(renderContext)
  isLoading.value = false
})

const downloadPdf = async () => {
  try {
    const response = await fetch(props.pdfUrl)
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
