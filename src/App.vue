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
    <transition name="slide-right">
      <RouterView />
    </transition>
  </div>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s ease-out;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}
</style>
