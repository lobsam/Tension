<template>
  <main>
    <section class="exhibition-page container-fluid px-3 px-sm-4 px-lg-5 py-4 py-md-5">
      <header class="exhibition-header mb-4">
        <h1 class="exhibition-title">Exhibition</h1>
      </header>

      <div v-if="showStatusNote" class="section-status-note">
        <p class="section-status-text">{{ statusMessage }}</p>
        <button
          v-if="sheetError"
          type="button"
          class="section-retry-button"
          @click="retryExhibition"
        >
          Retry exhibition
        </button>
      </div>

      <div v-else class="masonry">
        <figure
          v-for="photo in exhibitionPhotos"
          :key="photo.id || photo.image_url"
          class="masonry-item"
        >
          <img
            :src="photo.image_url"
            :alt="getPhotoAlt(photo)"
            class="masonry-image"
            loading="lazy"
          />
          <figcaption v-if="photo.caption" class="masonry-caption">
            {{ photo.caption }}
          </figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useSheetStore } from '@/stores/googleSheets'
import { computed } from 'vue'

const store = useSheetStore()

const rawRows = computed(() => store.dataFromSheetUrl.exhibition || [])
const isLoading = computed(() => store.isSheetLoading('exhibition'))
const sheetError = computed(() => store.getSheetError('exhibition'))

const isPublished = (row) => {
  const flag = String(row?.published ?? '').trim().toLowerCase()
  if (flag === '' || flag === 'true' || flag === '1' || flag === 'yes') {
    return true
  }
  return false
}

const exhibitionPhotos = computed(() => {
  const rows = Array.isArray(rawRows.value) ? rawRows.value : []

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

const showStatusNote = computed(() => exhibitionPhotos.value.length === 0)

const statusMessage = computed(() => {
  if (isLoading.value) {
    return 'Loading exhibition photos...'
  }

  if (sheetError.value) {
    return sheetError.value
  }

  return 'Exhibition photos are coming soon.'
})

const retryExhibition = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: ['exhibition'] })
}

const getPhotoAlt = (photo) => {
  if (photo?.alt) return photo.alt
  if (photo?.caption) return photo.caption
  return 'Exhibition photo'
}
</script>

<style scoped>
.exhibition-page {
  padding-bottom: 3rem;
}

.exhibition-title {
  font-weight: 800;
  letter-spacing: 0.02em;
  margin: 0;
}

.masonry {
  column-width: 280px;
  column-gap: 0.75rem;
}

@media (min-width: 992px) {
  .masonry {
    column-width: 320px;
    column-gap: 1rem;
  }
}

.masonry-item {
  break-inside: avoid;
  margin: 0 0 0.75rem;
  display: block;
  background: #f5f5f5;
}

@media (min-width: 992px) {
  .masonry-item {
    margin-bottom: 1rem;
  }
}

.masonry-image {
  display: block;
  width: 100%;
  height: auto;
}

.masonry-caption {
  font-size: 0.85rem;
  line-height: 1.35;
  padding: 0.5rem 0.65rem;
  color: #333;
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
