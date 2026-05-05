<template>
  <div
    class="modal"
    :id="'modal-art' + props.id"
    data-bs-backdrop="static"
    data-bs-keyboard="true"
    role="dialog"
    aria-modal="true"
    aria-hidden="true"
    :aria-labelledby="'modalLabel-' + props.id"
    tabindex="-1"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h2 :id="'modalLabel-' + props.id" class="visually-hidden">
            {{ props.art.title || 'Artwork details' }}
          </h2>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body d-flex justify-content-center">
          <div style="height: 100%; width: 50%" v-if="props.art.link_type == 'image'">
            <img
              :src="props.art.more_detail_link"
              class="card-img-top rounded-0"
              :alt="getModalImageAlt(props.art)"
            />
          </div>
          <div v-if="props.art.link_type == 'pdf'">
            <PdfReader :pdfUrl="props.art.more_detail_link" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PdfReader from './PdfReader.vue'
const props = defineProps({
  art: {
    type: Object,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const getModalImageAlt = (art) => {
  return art?.title ? `${art.title} full artwork` : 'Expanded artwork image'
}
</script>
