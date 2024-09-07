
<script setup>
import { ref, onMounted } from 'vue';
import { useSheetStore } from '@/stores/googleSheets';
import Header from "@/components/Header.vue"

const store = useSheetStore();

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  await store.fetchSheetData();
};

const jsonData = store.jsonData;
</script>

<template>
  <Header />
  <RouterView />
</template>

<style scoped>

</style>