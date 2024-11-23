<template>
  <div
    class="container-fluid containers p-sm-5 p-0 d-flex justify-content-center align-items-center"
  >
    <div class="content-wrapper my-sm-5 my-5">
      <div class="row">
        <div class="col col-12 col-sm-1 d-flex justify-content-center align-items-center">
          <div class="rotate-text" style="color: black">NARRATIVE LOGIC</div>
        </div>
        <div class="col col-12 col-sm-10 text-center">
          <div class="info-graph p-3 p-sm-5 justify-content-center">
            <img
              class="img-fluid mt-5"
              src="https://i.ibb.co/jJFR2QX/distress-min.png"
              alt="info-graph"
            />
          </div>
        </div>
        <div class="col col-12 col-sm-1 d-flex justify-content-center align-items-center">
          <div class="rotate-text" style="color: black">CONNECTING THREAD</div>
        </div>
      </div>
      <div class="row mt-5 d-flex justify-content-center align-items-center">
        <div class="col-12 col-sm-1">
          <div class="rotate-text" style="color: black">OUR HOPE</div>
        </div>
        <div class="col-12 col-sm-5">
          <div class="py-0 py-sm-2 ps-0 ps-sm-2">
            <img
              class="img-fluid mt-5"
              src="https://i.ibb.co/p0KsDLY/purpose-plain.png"
              alt="info-graph"
            />
          </div>
        </div>
        <div class="col-12 col-sm-6 text-start pe-0 pe-sm-5">
          <div
            class="p-4"
            style="font-size: 20px; color: black"
            v-for="(text, i) in purposebody"
            :key="i"
          >
            <p>{{ text }}</p>
          </div>
        </div>
      </div>
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

const purposebody = computed(() => {
  let purpose_list = []
  for (const key in props.pages[3]) {
    console.log(key)
    if (key.startsWith('paragraph_') && props.pages[3][key]) {
      purpose_list.push(props.pages[3][key])
    }
  }
  console.log('return data: ', purpose_list)
  return purpose_list
})
</script>
<style lang="css" scoped>
.containers {
  background-image: url('https://i.ibb.co/GPbHRqS/narative-background.png');
  background-position: center;
  background-size: cover; /* Ensures the image covers the entire container */
  background-repeat: no-repeat; /* Prevents the image from repeating */
}
.content-wrapper {
  font-family: 'Source Sans Pro', sans-serif;
  color: white;
  background-color: #d9d9d9b5;
  width: 90vw;
  min-height: 200vh;
  height: auto;
}
.rotate-text {
  transform: rotate(270deg);
  white-space: nowrap;
  font-weight: 900;
}

@media (min-width: 1200px) {
  .distress-text {
    font-size: 20px;
    font-weight: bolder;
  }
}
/* If the screen size is smaller than 1200px, set the font-size to 80px */
@media (max-width: 576px) {
  .distress-text {
    font-size: 20px;
    font-weight: bold;
  }
  .rotate-text {
    display: none;
  }
}
</style>
