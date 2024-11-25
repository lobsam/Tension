<template>
  <Header />
  <div class="row container-fluid">
    <div class="col col-1 d-flex">
      <div class="d-flex justify-content-center align-items-center">
        <span class="title">
          <p class="rotate-text">ETHNOGRAPHY</p>
          <p class="rotate-text">ECOLOGY</p>
          <p class="rotate-text">DESIGN</p>
        </span>
      </div>
    </div>
    <div class="col col-11">
      <div class="row mt-5">
        <div
          class="col col-12 col-sm-4"
          v-for="article in store.dataFromSheetUrl.articls"
          :key="article.id"
        >
          <div class="card mb-3 m-sm-1 rounded-0">
            <img :src="article.image_url" class="card-img-top rounded-0" :alt="article.image_url" />
            <div class="card-body">
              <h5 class="card-title">{{ article.title }}</h5>
              <p class="card-text">
                {{ article.description }}
              </p>
              <p v-if="article.artilcle_type == 'link'" class="card-text">
                <small style="font-weight: bolder" class="text-muted">
                  <a :href="article.article_link" target="_blank" rel="noopener noreferrer"
                    >READ MORE</a
                  >
                </small>
              </p>
              <div v-if="article.artilcle_type == 'self'">
                <small style="font-weight: bolder" class="text-muted">
                  <router-link :to="{ name: 'id', params: { id: article.id } }"
                    >READ MORE</router-link
                  >
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSheetStore } from '@/stores/googleSheets'
import Header from '@/components/Header.vue'
const store = useSheetStore()

// getArticleDetail()

// const getArticleDetail = () => {
//   const data = store.dataFromSheetUrl.self_published_articles.filter((article) => article.id == 1)
//   console.log
// }
</script>
<style scoped>
.rotate-text {
  transform: rotate(270deg);
  white-space: nowrap;
  font-weight: 900;
  padding: 70px;
}
a {
  text-decoration: none; /* Remove underline for all links */
  color: rgb(37, 37, 37); /* Set text color for all links */
}

a:hover {
  text-decoration: none; /* Ensure no underline on hover for all links */
}
</style>
