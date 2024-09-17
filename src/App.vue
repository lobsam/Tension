<script setup>
import { onMounted } from 'vue'
import { useSheetStore } from '@/stores/googleSheets'
import Header from '@/components/Header.vue'
import Loader from '@/components/Loader.vue'

const store = useSheetStore()

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  await store.fetchSheetData()
}
</script>

<template>
  <Loader v-if="store.loading" />
  <div v-else>
    <Header />
    <RouterView />
  </div>
</template>

<style scoped></style>
