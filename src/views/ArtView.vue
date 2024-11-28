<template>
  <Header />
  <div class="row container-fluid">
    <div class="col col-1">
      <div class="pt-5 d-flex justify-content-center align-items-end">
        <span class="">
          <p class="rotate-text">MAPS</p>
          <p class="rotate-text">BOOKLETS</p>
          <p class="rotate-text">ZINEBOOK</p>
        </span>
      </div>
    </div>
    <div class="col col-11">
      <div class="row mt-5">
        <div
          class="col col-12 col-sm-4"
          v-for="art in store.dataFromSheetUrl.art"
          :key="art.id"
          data-bs-toggle="modal"
          :data-bs-target="art.more_detail_link != '' ? '#modal-art' + art.id : null"
        >
          <div class="card mb-3 m-sm-1 rounded-0">
            <img :src="art.image_url" class="card-img-top rounded-0" :alt="art.image_url" />
            <div class="card-body">
              <h5 class="card-title">{{ art.title }}</h5>
            </div>
          </div>

          <ArtModal :art="art" :id="art.id" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ArtModal from '@/components/ArtModal.vue'
import Header from '@/components/Header.vue'
import { useSheetStore } from '@/stores/googleSheets'
const store = useSheetStore()
</script>
<style scoped>
.rotate-text {
  transform: rotate(-90deg);
  white-space: nowrap;
  font-weight: 900;
  color: black;
  padding: 120px;
}
</style>
