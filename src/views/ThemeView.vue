<template>
  <div class="container-fluid theme-section">
    <div class="row gx-3 gx-lg-4 align-items-stretch">
      <div class="col-12 col-lg-2 d-flex justify-content-center align-items-center theme-label-col">
        <div class="rotate-text">THEMATIC CONSIDERATIONS</div>
      </div>
      <div class="col-12 col-lg-8">
        <div v-if="!hasThemes" class="theme-status-note">
          <p class="theme-status-text">{{ statusMessage }}</p>
          <button
            v-if="props.errorMessage"
            type="button"
            class="theme-retry-button"
            @click="emit('retry')"
          >
            Retry theme content
          </button>
        </div>
        <div v-else class="row g-4 theme-card-grid justify-content-center">
          <div
            class="col-12 col-md-6 d-flex justify-content-center"
            v-for="(theme, i) in props.themes"
            :key="theme.id"
          >
            <button
              type="button"
              class="card rounded-0 p-2 theme-card"
              :style="getBackground(i, theme)"
              :aria-label="getCardAriaLabel(theme, i)"
              :aria-pressed="expandedIndex === i ? 'true' : 'false'"
              @mouseenter="setPreviewIndex(i)"
              @mouseleave="clearPreviewIndex"
              @focus="setPreviewIndex(i)"
              @blur="clearPreviewIndex"
              @click="toggleExpandedIndex(i)"
            >
              <div v-if="!isCardActive(i)" class="card-body theme-card-body theme-card-content">
                <h6 class="card-title mb-3 theme-title">
                  {{ theme.title }}
                </h6>
                <p class="card-text justify-content-center theme-description">
                  {{ theme.description }}
                </p>
              </div>
              <div
                v-if="isCardActive(i)"
                class="card-body theme-card-body d-flex justify-content-center align-items-center"
              >
                <h6 class="card-title mb-0 theme-image-description">
                  {{ theme.Image_description }}
                </h6>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-2 d-flex justify-content-center align-items-center theme-label-col">
        <div class="rotate-text">VISUAL EXPLORATONS</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
const emit = defineEmits(['retry'])
const props = defineProps({
  themes: {
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
const previewIndex = ref(null)
const expandedIndex = ref(null)
const themeColor = ['#C4A433', '#206856', '#205768', '#BF7575']
const hasThemes = computed(() => props.themes.length > 0)

const statusMessage = computed(() => {
  if (props.isLoading) {
    return 'Loading themes...'
  }

  if (props.errorMessage) {
    return props.errorMessage
  }

  return 'Themes are temporarily unavailable.'
})

const getRandomColor = (index) => {
  if (!themeColor.length) {
    return '#205768'
  }

  return themeColor[index % themeColor.length]
}
const isCardActive = (index) => {
  return expandedIndex.value === index || previewIndex.value === index
}

const setPreviewIndex = (index) => {
  previewIndex.value = index
}

const clearPreviewIndex = () => {
  previewIndex.value = null
}

const toggleExpandedIndex = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const getCardAriaLabel = (theme, index) => {
  const themeTitle = theme?.title || `Theme ${index + 1}`
  const action = expandedIndex.value === index ? 'Hide' : 'Show'
  return `${action} visual description for ${themeTitle}`
}

const getBackground = (index, theme) => {
  if (isCardActive(index) && theme?.image_url) {
    return {
      backgroundImage: `url('${theme.image_url}')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }
  } else {
    return { backgroundColor: getRandomColor(index) }
  }
}

// const aosStyle = (i) => {
//   return i % 2 !== 0 ? 'fade-left' : 'fade-right'
// }

// const hoverEnter = () => {
//   upHere.value = false
//   console.log('hover', upHere.value)
// }
// const hoverLeave = () => {
//   upHere.value = true
//   console.log('hover', upHere.value)
// }
</script>

<style scoped>
.theme-section {
  padding: 2rem 0.85rem;
  background-color: #fff;
}

.theme-card-grid {
  margin: 0;
}

.theme-status-note {
  border: 1px solid #333;
  padding: 1rem;
  min-height: 14rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.7rem;
}

.theme-status-text {
  margin: 0;
}

.theme-retry-button {
  border: 1px solid #333;
  background: white;
  color: #111;
  padding: 0.35rem 0.8rem;
}

.theme-label-col {
  padding-inline: 0;
}

.rotate-text {
  margin: 0.4rem 0;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  font-weight: 900;
  text-align: center;
}

.theme-card {
  display: block;
  text-align: left;
  width: 100%;
  max-width: 31rem;
  min-height: 20rem;
  color: white;
  border: none;
  cursor: pointer;
}

.theme-card:focus-visible {
  outline: 3px solid #111;
  outline-offset: 3px;
}

.theme-card-body {
  height: 100%;
  padding: 1.5rem 1.25rem;
}

.theme-card-content {
  padding-top: 3rem;
}

.theme-title {
  font-size: 1.1rem;
  font-weight: 800;
}

.theme-description {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}

.theme-image-description {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.45;
  text-align: center;
}

@media (min-width: 768px) {
  .theme-section {
    padding-inline: 1.5rem;
  }

  .theme-title {
    font-size: 1.25rem;
  }

  .theme-description {
    font-size: 1.05rem;
  }

  .theme-image-description {
    font-size: 1.05rem;
  }

  .theme-card-content {
    padding-top: 3.5rem;
  }
}

@media (min-width: 992px) {
  .theme-section {
    padding: 3.25rem 2rem;
  }

  .rotate-text {
    transform: rotate(270deg);
    white-space: nowrap;
    font-size: 0.95rem;
  }
}

@media (max-width: 576px) {
  .theme-card {
    min-height: 18rem;
  }
}
</style>
