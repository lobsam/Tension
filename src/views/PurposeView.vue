<template>
  <div class="page container">
    <div v-if="showStatusNote" class="purpose-status-note">
      <p class="mb-2">{{ statusMessage }}</p>
      <button
        v-if="props.errorMessage"
        type="button"
        class="purpose-retry-button"
        @click="emit('retry')"
      >
        Retry purpose content
      </button>
    </div>
    <div v-else class="purpose-description-list">
      <div v-for="(text, i) in purposeDescription" :key="i" class="purpose-description-card">
        {{ text }}
      </div>
    </div>
  </div>
  <div class="image-container">
    <img src="https://i.ibb.co/NSGFK1W/dholadhar.png" alt="Your Image" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
const emit = defineEmits(['retry'])
const props = defineProps({
  pages: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const getParagraphs = (page) => {
  if (!page || typeof page !== 'object') {
    return []
  }

  return Object.keys(page)
    .filter((key) => key.startsWith('paragraph_') && page[key])
    .sort((a, b) => Number(a.replace('paragraph_', '')) - Number(b.replace('paragraph_', '')))
    .map((key) => page[key])
}

const purposeDescription = computed(() => {
  const pages = Array.isArray(props.pages) ? props.pages : []
  return getParagraphs(pages[2])
})

const showStatusNote = computed(() => purposeDescription.value.length === 0)

const statusMessage = computed(() => {
  if (props.isLoading) {
    return 'Loading purpose content...'
  }

  if (props.errorMessage) {
    return props.errorMessage
  }

  return 'Purpose content is temporarily unavailable.'
})
</script>

<style scoped>
.page {
  font-family: 'Source Sans Pro', sans-serif;
  color: rgb(0, 0, 0);
  min-height: 70vh;
  height: auto;
}

.purpose-status-note {
  margin-top: 20vh;
  border: 1px solid #333;
  padding: 1rem;
  max-width: 36rem;
}

.purpose-description-list {
  margin-top: 30vh;
}

.purpose-description-card {
  font-size: 22px;
  color: #111;
  background-color: #fff;
  padding: 20px;
}

.purpose-retry-button {
  border: 1px solid #333;
  background: white;
  color: #111;
  padding: 0.35rem 0.8rem;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100px; /* Adjust this as per your requirement */
}

.image-container img {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: auto; /* This maintains the aspect ratio */
  object-fit: cover; /* Ensures the image covers the full width */
}

@media (max-width: 575.98px) {
  .purpose-description-list {
    margin-top: 12vh;
  }

  .purpose-description-card {
    font-size: 1.15rem;
    padding: 20px;
  }
}
</style>
