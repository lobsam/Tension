<template>
  <div v-if="isSheetLoading && !hasAnyArticles" class="container p-5">
    <h5 class="mb-3">Loading article</h5>
    <p class="mb-0">Please wait while the article content is loading.</p>
  </div>
  <div v-else-if="showSheetError" class="container p-5">
    <h5 class="mb-3">Article content unavailable</h5>
    <p class="mb-4">{{ sheetError }}</p>
    <button type="button" class="btn btn-outline-dark rounded-0 me-2" @click="retrySelfPublishedSheet">
      Retry
    </button>
    <router-link class="btn btn-outline-dark rounded-0" to="/articles">Back to articles</router-link>
  </div>
  <div v-else-if="article">
    <div>
      <img :src="article.image_url" class="card-img-top image" :alt="article.title || 'Article image'" />
    </div>
    <div class="card-body">
      <div class="p-5 container">
        <h5 class="card-title mb-5">{{ article.title }}</h5>
        <h6 v-if="article.header" class="card-text fw-bold">{{ article.header }}</h6>
        <p v-for="(paragraph, i) in parsedArticle" :key="i">{{ paragraph }}</p>
      </div>
    </div>
  </div>
  <div v-else class="container p-5">
    <h5 class="mb-3">Article unavailable</h5>
    <p class="mb-4">The requested article could not be found.</p>
    <router-link class="btn btn-outline-dark rounded-0" to="/articles">Back to articles</router-link>
  </div>
</template>

<script setup>
import { useSheetStore } from '@/stores/googleSheets'
import { computed } from 'vue'
const store = useSheetStore()

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const normalizedArticleId = computed(() => Number(props.id))
const selfPublishedArticles = computed(() => store.dataFromSheetUrl.self_published_articles || [])
const isSheetLoading = computed(() => store.isSheetLoading('self_published_articles'))
const sheetError = computed(() => store.getSheetError('self_published_articles'))
const hasAnyArticles = computed(() => selfPublishedArticles.value.length > 0)
const showSheetError = computed(() => Boolean(sheetError.value) && !hasAnyArticles.value)

const article = computed(() => {
  const sourceArticles = selfPublishedArticles.value

  if (!Array.isArray(sourceArticles) || !Number.isFinite(normalizedArticleId.value)) {
    return null
  }

  return (
    sourceArticles.find((entry) => {
      const entryId = Number(entry.article_id ?? entry.id)
      return Number.isFinite(entryId) && entryId === normalizedArticleId.value
    }) ?? null
  )
})

const parseArticle = (text) => {
  if (typeof text !== 'string') {
    return []
  }

  return text
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

const parsedArticle = computed(() => parseArticle(article.value?.article))

const retrySelfPublishedSheet = async () => {
  await store.fetchSheetData({
    force: true,
    sheetKeys: ['self_published_articles']
  })
}
</script>

<style scoped>
.image {
  margin-top: -10%;
}
</style>
