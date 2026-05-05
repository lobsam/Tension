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
  position: relative;
  z-index: 2;
  font-family: 'Source Sans Pro', sans-serif;
  color: rgb(0, 0, 0);
  min-height: 70vh;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: clamp(3rem, 8vh, 6rem);
  padding-bottom: clamp(4rem, 10vh, 8rem);
}

.purpose-status-note {
  margin: 0 auto;
  border: 1px solid #333;
  padding: 1rem;
  max-width: 36rem;
}

.purpose-description-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.purpose-description-card {
  font-size: clamp(0.95rem, 0.45vw + 0.8rem, 1.125rem);
  line-height: 1.7;
  letter-spacing: 0.005em;
  font-weight: 400;
  color: #1a1a1a;
  background-color: #fff;
  padding: clamp(2rem, 4vw, 3.25rem) clamp(2.25rem, 5vw, 4rem);
  width: 100%;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
  text-align: left;
}

.purpose-description-card + .purpose-description-card {
  margin-top: 1.25rem;
}

.purpose-retry-button {
  border: 1px solid #333;
  background: white;
  color: #111;
  padding: 0.35rem 0.8rem;
}

.image-container {
  position: relative;
  z-index: 1;
  width: 100%;
  line-height: 0;
}

.image-container img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

@media (max-width: 575.98px) {
  .page {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  .purpose-description-card {
    font-size: 0.95rem;
    line-height: 1.65;
    padding: 1.5rem 1.4rem;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
  }
}
</style>
