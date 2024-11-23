<template>
  <div class="page container">
    <div style="font-size: 22px; margin-top: 30vh" v-for="(text, i) in purposeDescription" :key="i">
      {{ text }}
    </div>
  </div>
  <div class="image-container">
    <img src="https://i.ibb.co/NSGFK1W/dholadhar.png" alt="Your Image" />
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
const purposeDescription = computed(() => {
  let purpose_list = []
  for (const key in props.pages[0]) {
    if (key.startsWith('paragraph_') && props.pages[0][key]) {
      purpose_list.push(props.pages[2][key])
    }
  }
  return purpose_list
})
</script>

<style scoped>
.page {
  font-family: 'Source Sans Pro', sans-serif;
  color: rgb(0, 0, 0);
  min-height: 70vh;
  height: auto;
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
</style>
