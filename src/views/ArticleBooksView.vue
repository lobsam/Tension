<template>
  <main>
    <section class="articles-page container-fluid px-3 px-sm-4 px-lg-5 py-4 py-md-5">
      <div class="row gx-3 gx-lg-4">
        <!--
          Label stack (ETHNOGRAPHY / ECOLOGY / DESIGN) temporarily hidden until
          content direction is finalized. Styles for `.label-stack` and
          `.rotate-text` are preserved below so this block can be re-enabled
          without further CSS work.

          <div class="col-12 col-md-2">
            <div class="label-stack">
              <p class="rotate-text">ETHNOGRAPHY</p>
              <p class="rotate-text">ECOLOGY</p>
              <p class="rotate-text">DESIGN</p>
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
              @click="retryArticles"
            >
              Retry articles
            </button>
          </div>
          <div v-else class="row g-3 g-sm-4 mt-1 mt-md-0">
            <div
              class="col-12 col-sm-6 col-xl-4"
              v-for="article in articles"
              :key="article.id"
            >
              <div class="card article-card mb-0 rounded-0">
                <img
                  :src="article.image_url"
                  class="card-img-top rounded-0"
                  :alt="getArticleImageAlt(article)"
                />
                <div class="card-body">
                  <h5 class="card-title">{{ article.title }}</h5>
                  <p class="card-text">
                    {{ article.description }}
                  </p>
                  <p v-if="article.artilcle_type == 'link'" class="card-text">
                    <small class="text-muted fw-bold">
                      <a
                        class="article-link"
                        :href="article.article_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        :aria-label="getExternalReadMoreLabel(article)"
                        >READ MORE</a
                      >
                    </small>
                  </p>
                  <div v-if="article.artilcle_type == 'self'">
                    <small class="text-muted fw-bold">
                      <router-link
                        class="article-link"
                        :to="{ name: 'article-detail', params: { id: article.id || article.article_id } }"
                        :aria-label="getInternalReadMoreLabel(article)"
                      >
                        READ MORE
                      </router-link>
                    </small>
                  </div>
                </div>
              </div>
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

const articles = computed(() => store.dataFromSheetUrl.articls || [])
const isLoading = computed(() => store.isSheetLoading('articls'))
const sheetError = computed(() => store.getSheetError('articls'))
const showStatusNote = computed(() => articles.value.length === 0)

const statusMessage = computed(() => {
  if (isLoading.value) {
    return 'Loading articles...'
  }

  if (sheetError.value) {
    return sheetError.value
  }

  return 'No articles are available right now.'
})

const retryArticles = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: ['articls'] })
}

const getArticleImageAlt = (article) => {
  return article?.title ? `${article.title} cover image` : 'Article cover image'
}

const getExternalReadMoreLabel = (article) => {
  const title = article?.title || 'article'
  return `Read more about ${title} (opens in a new tab)`
}

const getInternalReadMoreLabel = (article) => {
  const title = article?.title || 'article'
  return `Read more about ${title}`
}
</script>
<style scoped>
.articles-page {
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
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: #111;
}

.article-card {
  height: 100%;
}

.article-card .card-img-top {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.article-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
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

.article-link {
  text-decoration: none;
  color: rgb(37, 37, 37);
}

.article-link:hover {
  text-decoration: none;
  color: rgb(14, 14, 14);
  background-color: transparent;
}

.article-link:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
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
