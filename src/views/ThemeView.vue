<template>
  <div class="container-fluid">
    <div class="row my-5">
      <div class="col-sm-3 d-flex justify-content-center align-items-center">
        <div class="rotate-text">THEMATIC CONSIDERATIONS</div>
      </div>
      <div class="col-sm-6 col-12">
        <div class="row g-5 my-5 justify-content-center align-items-center">
          <div
            class="col-sm-6 d-flex justify-content-center align-items-center"
            v-for="(theme, i) in props.themes"
            :key="theme.id"
          >
            <div
              :data-aos="aosStyle(i)"
              class="card rounded-0"
              :style="{ backgroundColor: getRandomColor(i) }"
              style="height: 22rem; width: 22rem; color: white"
            >
              <div class="card-body pt-4" style="margin-top: 60px">
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
const props = defineProps({
  themes: {
    type: Object,
    required: true
  }
})
const themeColor = ['#C4A433', '#206856', '#205768', '#BF7575']
const getRandomColor = (i) => {
  return themeColor[i]
}

const aosStyle = (i) => {
  return i % 2 !== 0 ? 'fade-left' : 'fade-right'
}
</script>

<style scope>
.rotate-text {
  transform: rotate(270deg);
  white-space: nowrap;
  font-weight: 900;
}

@media (min-width: 576px) {
  .rotate-text {
    opacity: 1;
  }
}
</style>
