<template>
  <main>
    <section class="art-page container-fluid px-3 px-sm-4 px-lg-5 py-4 py-md-5">
      <div class="row gx-3 gx-lg-4">
        <!--
          Label stack (MAPS / BOOKLETS / ZINEBOOK) temporarily hidden until
          content direction is finalized. Styles for `.label-stack` and
          `.rotate-text` are preserved below so this block can be re-enabled
          without further CSS work.

          <div class="col-12 col-md-2">
            <div class="label-stack">
              <p class="rotate-text">MAPS</p>
              <p class="rotate-text">BOOKLETS</p>
              <p class="rotate-text">ZINEBOOK</p>
            </div>
          </div>
        -->
        <div class="col-12">
          <div v-if="showStatusNote" class="section-status-note">
            <p class="section-status-text">{{ statusMessage }}</p>
            <button
              v-if="sheetError"
              type="button"
              class="section-retry-button"
              @click="retryArt"
            >
              Retry art content
            </button>
          </div>
          <div v-else class="row g-3 g-sm-4 mt-1 mt-md-0">
            <div
              class="col-12 col-sm-6 col-xl-4"
              v-for="art in artItems"
              :key="art.id"
            >
              <router-link
                :to="{ name: 'art-detail', params: { id: art.id } }"
                class="art-card-link"
                :aria-label="getArtLinkLabel(art)"
              >
                <div class="card art-card mb-0 rounded-0">
                  <img :src="art.image_url" class="card-img-top rounded-0" :alt="getArtImageAlt(art)" />
                  <div class="card-body">
                    <h5 class="card-title">{{ art.title }}</h5>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
import { useSheetStore } from '@/stores/googleSheets'
import { computed } from 'vue'
const store = useSheetStore()

const artItems = computed(() => store.dataFromSheetUrl.art || [])
const isLoading = computed(() => store.isSheetLoading('art'))
const sheetError = computed(() => store.getSheetError('art'))
const showStatusNote = computed(() => artItems.value.length === 0)

const statusMessage = computed(() => {
  if (isLoading.value) {
    return 'Loading art content...'
  }

  if (sheetError.value) {
    return sheetError.value
  }

  return 'No art entries are available right now.'
})

const retryArt = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: ['art'] })
}

const getArtImageAlt = (art) => {
  return art?.title ? `${art.title} artwork preview` : 'Artwork preview'
}

const getArtLinkLabel = (art) => {
  const artTitle = art?.title || 'artwork'
  return `Open ${artTitle}`
}
</script>
<style scoped>
.art-page {
  padding-bottom: 3rem;
}

.label-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.55rem;
  margin-bottom: 0.8rem;
}

.rotate-text {
  margin: 0;
  padding: 0.2rem 0.45rem;
  font-weight: 900;
  color: black;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.art-card {
  height: 100%;
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

.art-card-link {
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.art-card-link:hover,
.art-card-link:focus {
  color: inherit;
  text-decoration: none;
}

.art-card-link:focus-visible {
  outline: 3px solid #111;
  outline-offset: 3px;
}

.art-card .card-img-top {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

@media (min-width: 768px) {
  .label-stack {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100%;
    padding-top: 0.75rem;
    gap: 1.25rem;
  }

  .rotate-text {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 0.92rem;
    padding: 0;
    letter-spacing: 0.08em;
  }
}
</style>
