<template>
  <main>
    <div v-if="isArtLoading && !art" class="container p-5">
      <h5 class="mb-3">Loading</h5>
      <p class="mb-0">Please wait while the content loads.</p>
    </div>
    <div v-else-if="showArtError" class="container p-5">
      <h5 class="mb-3">Content unavailable</h5>
      <p class="mb-4">{{ artError }}</p>
      <button
        type="button"
        class="btn btn-outline-dark rounded-0 me-2"
        @click="retryArt"
      >
        Retry
      </button>
      <router-link class="btn btn-outline-dark rounded-0" to="/art">Back to art</router-link>
    </div>
    <section
      v-else-if="art"
      class="art-detail container-fluid px-3 px-sm-4 px-lg-5 py-4 py-md-5"
    >
      <header class="art-detail-header mb-4">
        <router-link class="btn btn-outline-dark rounded-0" to="/art">Back to art</router-link>
        <h1 v-if="art.title" class="art-detail-title mt-3">{{ art.title }}</h1>
      </header>

      <template v-if="contentType === 'gallery'">
        <div v-if="showGalleryStatus" class="section-status-note">
          <p class="section-status-text">{{ galleryStatusMessage }}</p>
          <button
            v-if="galleryError"
            type="button"
            class="section-retry-button"
            @click="retryGallery"
          >
            Retry photos
          </button>
        </div>
        <div v-else class="gallery-stack">
          <figure
            v-for="photo in galleryPhotos"
            :key="photo.id || photo.image_url"
            class="gallery-stack-item"
          >
            <img
              :src="photo.image_url"
              :alt="getPhotoAlt(photo)"
              class="gallery-stack-image"
              loading="lazy"
            />
            <figcaption v-if="photo.caption" class="gallery-stack-caption">
              {{ photo.caption }}
            </figcaption>
          </figure>
        </div>
      </template>

      <template v-else-if="contentType === 'pdf'">
        <PdfReader :pdfUrl="art.more_detail_link" />
      </template>

      <template v-else-if="contentType === 'image'">
        <div class="art-detail-image-wrap">
          <img
            :src="art.more_detail_link || art.image_url"
            :alt="detailImageAlt"
            class="art-detail-image"
          />
        </div>
      </template>

      <template v-else>
        <div class="art-detail-image-wrap">
          <img :src="art.image_url" :alt="detailImageAlt" class="art-detail-image" />
        </div>
      </template>
    </section>
    <div v-else class="container p-5">
      <h5 class="mb-3">Item not found</h5>
      <p class="mb-4">The requested item could not be found.</p>
      <router-link class="btn btn-outline-dark rounded-0" to="/art">Back to art</router-link>
    </div>
  </main>
</template>

<script setup>
import PdfReader from '@/components/PdfReader.vue'
import { useSheetStore } from '@/stores/googleSheets'
import { computed } from 'vue'

const store = useSheetStore()

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const artItems = computed(() => store.dataFromSheetUrl.art || [])
const isArtLoading = computed(() => store.isSheetLoading('art'))
const artError = computed(() => store.getSheetError('art'))

const art = computed(() => {
  const items = artItems.value
  if (!Array.isArray(items)) {
    return null
  }

  const rawId = String(props.id)
  return items.find((entry) => String(entry?.id ?? '') === rawId) ?? null
})

const showArtError = computed(() => Boolean(artError.value) && !art.value)

const contentType = computed(() => {
  const value = String(art.value?.link_type ?? '').trim().toLowerCase()
  if (value === 'gallery' || value === 'masonry' || value === 'photos') {
    return 'gallery'
  }
  if (value === 'pdf') return 'pdf'
  if (value === 'image') return 'image'
  return ''
})

const detailImageAlt = computed(() => {
  return art.value?.title ? `${art.value.title} artwork` : 'Artwork'
})

const retryArt = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: ['art'] })
}

const DEFAULT_GALLERY_SHEET_KEY = 'exhibition'

const gallerySheetKey = computed(() => {
  const requested = String(art.value?.gallery_sheet ?? '')
    .trim()
    .toLowerCase()

  if (requested && requested in store.dataFromSheetUrl) {
    return requested
  }
  return DEFAULT_GALLERY_SHEET_KEY
})

const galleryRows = computed(() => store.dataFromSheetUrl[gallerySheetKey.value] || [])
const isGalleryLoading = computed(() => store.isSheetLoading(gallerySheetKey.value))
const galleryError = computed(() => store.getSheetError(gallerySheetKey.value))

const isPublished = (row) => {
  const flag = String(row?.published ?? '').trim().toLowerCase()
  if (flag === '' || flag === 'true' || flag === '1' || flag === 'yes') {
    return true
  }
  return false
}

const galleryPhotos = computed(() => {
  const rows = Array.isArray(galleryRows.value) ? galleryRows.value : []

  return rows
    .filter((row) => row && row.image_url && isPublished(row))
    .slice()
    .sort((a, b) => {
      const orderA = Number(a.order)
      const orderB = Number(b.order)
      const safeA = Number.isFinite(orderA) ? orderA : Number.POSITIVE_INFINITY
      const safeB = Number.isFinite(orderB) ? orderB : Number.POSITIVE_INFINITY

      if (safeA !== safeB) {
        return safeA - safeB
      }

      const idA = Number(a.id)
      const idB = Number(b.id)
      if (Number.isFinite(idA) && Number.isFinite(idB)) {
        return idA - idB
      }
      return 0
    })
})

const showGalleryStatus = computed(() => galleryPhotos.value.length === 0)

const galleryStatusMessage = computed(() => {
  if (isGalleryLoading.value) {
    return 'Loading photos...'
  }

  if (galleryError.value) {
    return galleryError.value
  }

  return 'Photos for this gallery are coming soon.'
})

const retryGallery = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: [gallerySheetKey.value] })
}

const getPhotoAlt = (photo) => {
  if (photo?.alt) return photo.alt
  if (photo?.caption) return photo.caption
  return 'Gallery photo'
}
</script>

<style scoped>
.art-detail {
  padding-bottom: 3rem;
}

.art-detail-title {
  font-weight: 800;
  letter-spacing: 0.02em;
  margin: 0;
}

.art-detail-image-wrap {
  display: flex;
  justify-content: center;
}

.art-detail-image {
  max-width: 100%;
  height: auto;
}

.gallery-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.gallery-stack-item {
  width: 100%;
  max-width: 900px;
  margin: 0;
  background: #f5f5f5;
}

.gallery-stack-image {
  display: block;
  width: 100%;
  height: auto;
}

.gallery-stack-caption {
  font-size: 0.85rem;
  line-height: 1.4;
  padding: 0.5rem 0.65rem;
  color: #333;
  text-align: left;
}

.section-status-note {
  border: 1px solid #111;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.section-status-text {
  margin: 0;
}

.section-retry-button {
  border: 1px solid #111;
  background: white;
  color: #111;
  padding: 0.35rem 0.8rem;
}
</style>
