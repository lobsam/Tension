<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSheetStore } from '@/stores/googleSheets'
import Loader from '@/components/Loader.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
const store = useSheetStore()
const router = useRouter()
const route = useRoute()

const isHomePage = computed(() => route.name === 'home')

const transitionName = ref('')

router.beforeEach((to, from) => {
  if (from.name === 'home' && to.name === 'articles') {
    transitionName.value = 'pan-in-left'
  } else if (from.name === 'articles' && to.name === 'home') {
    transitionName.value = 'pan-out-right'
  } else if (from.name === 'home' && to.name === 'art') {
    transitionName.value = 'pan-out-right'
  } else if (from.name === 'art' && to.name === 'home') {
    transitionName.value = 'pan-in-left'
  } else {
    transitionName.value = ''
  }
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  await store.fetchSheetData()
}

const showInitialLoader = computed(() => store.loading && !store.hasLoadedOnce && !store.hasAnyData)

const failedSheetLabels = computed(() =>
  store.failedSheets.map((sheetKey) => sheetKey.replace(/_/g, ' '))
)

const showLoadWarning = computed(() => store.hasLoadedOnce && store.hasPartialFailures)

const retryFailedSheets = async () => {
  await store.retryFailedSheets()
}
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--home': isHomePage }">
    <transition name="loader-fade">
      <Loader v-if="showInitialLoader" />
    </transition>

    <div v-if="showLoadWarning" class="sheet-warning-banner" role="status" aria-live="polite">
      <p class="sheet-warning-text">
        Some sections could not be loaded:
        <span class="text-capitalize">{{ failedSheetLabels.join(', ') }}</span
        >.
      </p>
      <button
        type="button"
        class="sheet-warning-button"
        :disabled="store.loading"
        @click="retryFailedSheets"
      >
        {{ store.loading ? 'Retrying...' : 'Retry failed sections' }}
      </button>
    </div>

    <Header :isHomePage="isHomePage" />
    <transition :name="transitionName" mode="out-in">
      <RouterView />
    </transition>
    <Footer />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  position: relative;
}

/* Anchor the landing background to the viewport on the home route so it
   renders in the same position as the initial loader state and does not
   jolt during router-view slide transitions. Kept outside the transitioning
   <RouterView> on purpose — ancestor transforms would otherwise break
   background-attachment: fixed. */
.app-shell--home {
  background: url('/landing.png') center / cover no-repeat fixed;
}

@media (max-width: 575.98px) {
  .app-shell--home {
    background-attachment: scroll;
  }
}

.pan-in-left-enter-active {
  transition: transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.55s ease-out;
  will-change: transform, opacity;
}

.pan-in-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.pan-in-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.pan-out-right-enter-active {
  transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.5s ease-out;
  will-change: transform, opacity;
}

.pan-out-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.pan-out-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .pan-in-left-enter-active,
  .pan-out-right-enter-active {
    transition: opacity 0.2s ease-out;
  }

  .pan-in-left-enter-from,
  .pan-out-right-enter-from {
    transform: none;
  }
}

.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}

.sheet-warning-banner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin: 0.75rem 1rem 0;
  padding: 0.75rem 1rem;
  border: 1px solid #d58f1b;
  background: #fff6e7;
  color: #4c2f00;
}

.sheet-warning-text {
  margin: 0;
  font-size: 0.95rem;
}

.sheet-warning-button {
  border: 1px solid #4c2f00;
  background: white;
  color: #4c2f00;
  padding: 0.35rem 0.85rem;
  font-size: 0.9rem;
}

.sheet-warning-button:disabled {
  opacity: 0.6;
}
</style>
