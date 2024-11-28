<template>
  <div class="container-fluid">
    <div class="row my-5">
      <div class="col-sm-3 d-flex justify-content-center align-items-center">
        <div class="rotate-text">THEMATIC CONSIDERATIONS</div>
      </div>
      <div class="col-sm-6 col-12">
        <div class="row g-5 my-5 justify-content-center align-items-top">
          <div
            class="col-sm-6 d-flex justify-content-center align-items-top"
            v-for="(theme, i) in props.themes"
            :key="theme.id"
          >
            <div
              class="card rounded-0 p-2"
              :style="getBackground(i, theme)"
              style="width: 497px; color: white"
              @mouseover="hoveredIndex = i"
              @mouseleave="hoveredIndex = null"
            >
              <div v-if="hoveredIndex !== i" class="card-body pt-4" style="margin-top: 60px">
                <h6 class="card-title mb-3" style="font-size: 20px; font-weight: 800">
                  {{ theme.title }}
                </h6>
                <p
                  class="card-text justify-content-center"
                  style="font-size: 18px; font-weight: 500"
                >
                  {{ theme.description }}
                </p>
              </div>
              <div
                v-if="hoveredIndex == i"
                class="card-body pt-4 d-flex justify-content-center align-items-center"
              >
                <h6 class="card-title mb-3" style="font-size: 16px; font-weight: 800">
                  {{ theme.Image_description }}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-3 col-12 d-flex justify-content-center align-items-center">
        <div class="rotate-text">VISUAL EXPLORATONS</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  themes: {
    type: Object,
    required: true
  }
})
const hoveredIndex = ref(null)
const themeColor = ['#C4A433', '#206856', '#205768', '#BF7575']
const getRandomColor = (i) => {
  return themeColor[i]
}
const getBackground = (index, theme) => {
  if (hoveredIndex.value === index) {
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

<style scope>
.rotate-text {
  transform: rotate(270deg);
  white-space: nowrap;
  font-weight: 900;
}

@media (max-width: 576px) {
  .rotate-text {
    display: none;
  }
}
</style>
