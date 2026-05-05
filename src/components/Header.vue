<template>
  <nav class="navbar sticky-top px-0" style="background: #256199" aria-label="Primary navigation">
    <div class="container-fluid px-4 px-sm-5 py-2">
      <router-link class="navbar-brand fs-6 text-uppercase fw-bold" style="color: white" to="/"
        >PROJECT TENSION<span v-if="pageLabel"> // {{ pageLabel }}</span></router-link
      >
      <div class="nav-item text-uppercase fw-bold d-flex align-items-center">
        <router-link
          v-if="props.isHomePage"
          class="nav-icon-link"
          to="/art"
          aria-label="Go to art page"
          title="Go to art page"
        >
          <MenuIcon />
        </router-link>
        <router-link
          v-if="!props.isHomePage"
          class="nav-icon-link"
          to="/"
          aria-label="Go to home page"
          title="Go to home page"
        >
          <HomeIcon />
        </router-link>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MenuIcon from '../assets/MenuIcon.vue'
import HomeIcon from '../assets/HomeIcon.vue'

const props = defineProps({
  isHomePage: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const pageLabel = computed(() => {
  switch (route.name) {
    case 'articles':
    case 'article-detail':
      return 'ARTICLES'
    case 'art':
      return 'ART'
    case 'exhibition':
      return 'EXHIBITION'
    default:
      return ''
  }
})
</script>

<style>
.navbar-brand {
  color: white;
}

.nav-icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.nav-icon-link:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
  border-radius: 999px;
}
</style>
