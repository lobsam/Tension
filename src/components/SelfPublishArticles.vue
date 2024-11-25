<template>
  <Header />
  <div>
    <img :src="article.data.image_url" class="card-img-top image" :alt="article.data.image_url" />
  </div>
  <div class="card-body">
    <div class="p-5 container">
      <h5 class="card-title mb-5">{{ article.data.title }}</h5>
      <h6 class="card-text fw-bold">{{ article.data.header }}</h6>
      <p v-for="(p, i) in parseArticle(article.data.article)" :key="i">{{ p }}</p>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import { useSheetStore } from '@/stores/googleSheets'
import { onMounted, reactive } from 'vue'

const route = useRoute()
const store = useSheetStore()
const article = reactive({
  data: {}
})

onMounted(() => {
  getIdArticle()
  console.log('heheh: ', article.data)
})

console.log(store.dataFromSheetUrl.self_published_articles)

const getIdArticle = () => {
  article.data = store.dataFromSheetUrl.self_published_articles.filter(
    (article) => Number(article.article_id) == Number(route.params.id)
  )[0]
}
const parseArticle = (text) => {
  // Split the text into paragraphs by double newlines
  const paragraphs = String(text)
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p)

  // Create HTML paragraphs
  // return paragraphs.map((p) => `<p>${p}</p>`).join('\n')
  return paragraphs
}
</script>

<style scoped>
.image {
  margin-top: -10%;
}
</style>
