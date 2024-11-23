<template>
  <div class="landing-page container-fluid">
    <div class="row p-0 p-sm-5">
      <div class="col col-sm-6 col-12" style="margin-top: 12%">
        <h1 class="header-title text-uppercase text-center justify-content-center">Tension</h1>
      </div>
      <div class="col col-sm-3 col-12" style="margin-top: 12%">
        <div
          style="font-style: italic; font-size: 22px"
          v-for="(text, i) in landingPage.dialogText"
          :key="i"
        >
          {{ text }}
        </div>
      </div>
      <div class="col col-sm-3 col-12" style="margin-top: 12%">
        <div v-for="(text, i) in landingPage.bodyText" :key="i">{{ text }}</div>
      </div>
    </div>
    <div class="p-5">
      <span class="text-uppercase">
        <router-link style="font-size: 25px; color: white" to="/articles"
          >Article/Books</router-link
        >
      </span>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  pages: {
    type: Object,
    required: true
  }
})
const dialogText = []
const bodyText = []

const landingPage = computed(() => {
  for (const key in props.pages[0]) {
    if (key.startsWith('paragraph_') && props.pages[0][key]) {
      dialogText.push(props.pages[0][key])
    }
  }
  for (const key in props.pages[1]) {
    if (key.startsWith('paragraph_') && props.pages[1][key]) {
      bodyText.push(props.pages[1][key])
    }
  }
  return { bodyText, dialogText }
})
</script>

<style>
.header-title {
  font-size: 10vw;
  font-weight: 1000;
}
.landing-page {
  font-family: 'Source Sans Pro', sans-serif;
  color: white;
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background: url('https://i.ibb.co/DVKFfVM/sleeping-kits.png');
  background-position: center;
  background-size: cover; /* Ensures the image covers the entire container */
  background-repeat: no-repeat; /* Prevents the image from repeating */
}

@media (min-width: 576px) {
  /* sm (small) devices */
  .header-title {
    font-size: 6vw; /* Adjust for larger screens */
  }
}
</style>
