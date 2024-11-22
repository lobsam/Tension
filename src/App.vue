<script setup>
import { onMounted } from 'vue'
import { useSheetStore } from '@/stores/googleSheets'
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
    <RouterView />
  </div>
</template>

<style scoped></style>
