<template>
  <div class="landing-page container-fluid px-0">
    <div class="landing-content row align-items-start gx-0 gx-sm-4 gx-lg-5 px-4 px-sm-5">
      <div class="col-12 col-sm-6 landing-title-col ps-0">
        <h1 class="header-title text-uppercase">Tension</h1>
        <router-link
          class="header-articles-link text-uppercase fw-bold"
          to="/articles"
          aria-label="Go to articles and books page"
        >
          <span class="header-articles-link__text">  >>Articles / Writings</span>
        </router-link>
      </div>
      <div class="col-12 col-sm-3 landing-text-col landing-dialog ps-sm-0">
        <p
          v-for="(text, i) in landingPage.dialogText"
          :key="i"
        >
          {{ text }}
        </p>
      </div>
      <div class="col-12 col-sm-3 landing-text-col landing-body ps-sm-0">
        <p v-for="(text, i) in landingPage.bodyText" :key="i">{{ text }}</p>
      </div>
    </div>
    <div v-if="showStatusNote" class="landing-status-note mx-4 mx-sm-5 mb-3">
      <p class="landing-status-text">
        {{ statusMessage }}
      </p>
      <button
        v-if="props.errorMessage"
        type="button"
        class="landing-retry-button"
        @click="emit('retry')"
      >
        Retry home content
      </button>
    </div>
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
    .sort((a, b) => {
      const orderA = Number(a.replace('paragraph_', '')) || 0
      const orderB = Number(b.replace('paragraph_', '')) || 0
      return orderA - orderB
    })
    .map((key) => page[key])
}

const landingPage = computed(() => {
  const pages = Array.isArray(props.pages) ? props.pages : []
  const [dialogPage = {}, bodyPage = {}] = pages

  return {
    dialogText: getParagraphs(dialogPage),
    bodyText: getParagraphs(bodyPage)
  }
})

const hasContent = computed(
  () => landingPage.value.dialogText.length > 0 || landingPage.value.bodyText.length > 0
)

const showStatusNote = computed(() => !hasContent.value)

const statusMessage = computed(() => {
  if (props.isLoading) {
    return 'Loading home content...'
  }

  if (props.errorMessage) {
    return props.errorMessage
  }

  return 'Home content is temporarily unavailable.'
})
</script>

<style>
.landing-page {
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'Source Sans Pro', sans-serif;
  color: white;
  width: 100%;
  min-height: calc(100vh - 50px);
  padding-bottom: 1rem;
  background: transparent;
}

.landing-content {
  padding-top: clamp(2rem, 8vh, 8rem);
  padding-bottom: clamp(1.5rem, 3vh, 2.5rem);
  flex: 1 1 auto;
}

.header-title {
  font-size: clamp(3.5rem, 14vw, 9rem);
  font-weight: 1000;
  margin: 0;
  line-height: 0.85;
  letter-spacing: -0.01em;
}

.landing-title-col {
  padding-left: 14px !important;
}

.header-articles-link {
  display: inline-block;
  margin-top: 0.6rem;
  color: #ffd447;
  background: transparent;
  text-decoration: none;
  font-size: clamp(1rem, 0.6vw + 0.85rem, 1.35rem);
  letter-spacing: 0.04em;
  transition: color 0.15s ease, transform 0.15s ease;
}

.header-articles-link:hover,
.header-articles-link:focus-visible {
  color: #ffe27a;
  transform: translateY(-1px);
}

.header-articles-link:focus-visible {
  outline: 2px solid #ffd447;
  outline-offset: 3px;
}

.landing-text-col {
  padding-top: 0.35em;
  font-size: clamp(1rem, 1.05vw + 0.6rem, 1.5rem);
  line-height: 1.5;
}

.landing-text-col p {
  margin-bottom: 0.85em;
}

.landing-text-col p:last-child {
  margin-bottom: 0;
}

.landing-dialog {
  font-style: italic;
  font-size: clamp(1.05rem, 1.2vw + 0.7rem, 1.75rem);
  line-height: 1.45;
}

.landing-status-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.45);
  padding: 0.7rem 0.85rem;
}

.landing-status-text {
  margin: 0;
  font-size: 0.95rem;
}

.landing-retry-button {
  border: 1px solid white;
  background: transparent;
  color: white;
  font-size: 0.85rem;
  padding: 0.3rem 0.7rem;
}

/* Tablet / small desktop */
@media (min-width: 576px) {
  .header-title {
    font-size: clamp(4rem, 8vw, 10rem);
  }

  .landing-page {
    height: calc(100vh - 50px);
    min-height: 0;
    padding-bottom: 0;
    overflow: hidden;
  }

  /* Anchor the yellow "Articles / Writings" call-out to the bottom-left
     of the viewport, diagonally opposite the top-right nav icon. */
  .header-articles-link {
    position: absolute;
    left: 3rem; /* matches .landing-content px-sm-5 (Bootstrap 3rem) */
    bottom: 4rem; /* ~40px — lifts the link off the edge for breathing room */
    margin-top: 0;
    z-index: 2;
  }
}

/* Large desktops — cap text column width and improve readability */
@media (min-width: 1400px) {
  .landing-text-col {
    max-width: 32ch;
  }

  .landing-dialog {
    max-width: 28ch;
  }
}

/* Ultra-wide screens — prevent text from becoming too large or spread out */
@media (min-width: 1920px) {
  .header-title {
    font-size: clamp(8rem, 7vw, 12rem);
  }
}

/* Mobile — stack content with comfortable spacing */
@media (max-width: 575.98px) {
  .landing-content {
    padding-top: 2rem;
    padding-bottom: 1rem;
    row-gap: 1.25rem;
  }

  .landing-title-col {
    padding-left: 0 !important;
  }

  .landing-text-col {
    padding-top: 0;
  }
}
</style>
