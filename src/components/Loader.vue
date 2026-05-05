<template>
  <div class="contain">
    <canvas ref="canvas"></canvas>
    <div class="loader">
      <span v-for="n in 8" :key="n"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let animationId = null

onMounted(() => {
  const cvs = canvas.value
  const ctx = cvs.getContext('2d')
  const img = new Image()

  const resize = () => {
    cvs.width = window.innerWidth
    cvs.height = window.innerHeight
  }

  const drawPixelated = (resolution) => {
    const w = cvs.width
    const h = cvs.height

    const imgAspect = img.width / img.height
    const cvsAspect = w / h
    let sw, sh, sx, sy
    if (cvsAspect > imgAspect) {
      sw = img.width
      sh = img.width / cvsAspect
      sx = 0
      sy = (img.height - sh) / 2
    } else {
      sh = img.height
      sw = img.height * cvsAspect
      sy = 0
      sx = (img.width - sw) / 2
    }

    const offscreen = document.createElement('canvas')
    offscreen.width = resolution
    offscreen.height = Math.round(resolution * (h / w))
    const offCtx = offscreen.getContext('2d')
    offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, offscreen.width, offscreen.height)

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(offscreen, 0, 0, w, h)
  }

  const steps = [4, 6, 10, 16, 24, 40, 64, 100, 160, 260, 420, 700]
  const stepDuration = 180
  let stepIndex = 0
  let startTime = null

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const targetStep = Math.min(Math.floor(elapsed / stepDuration), steps.length - 1)

    if (targetStep > stepIndex) {
      stepIndex = targetStep
      drawPixelated(steps[stepIndex])
    } else if (stepIndex === 0) {
      drawPixelated(steps[0])
    }

    if (stepIndex < steps.length - 1) {
      animationId = requestAnimationFrame(animate)
    }
  }

  img.onload = () => {
    resize()
    animationId = requestAnimationFrame(animate)
  }

  img.src = '/landing.png'
  window.addEventListener('resize', resize)

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<style>
.contain {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #333;
  overflow: hidden;
  z-index: 9999;
}

.contain canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.loader {
  position: relative;
  z-index: 1;
  width: 56px;
  height: 56px;
}

.loader span {
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 16px;
  margin-left: -2px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 2px;
  transform-origin: center 28px;
  opacity: 0.15;
  animation: fade 1s infinite linear;
}

.loader span:nth-child(1) { transform: rotate(0deg);   animation-delay: 0s; }
.loader span:nth-child(2) { transform: rotate(45deg);  animation-delay: 0.125s; }
.loader span:nth-child(3) { transform: rotate(90deg);  animation-delay: 0.25s; }
.loader span:nth-child(4) { transform: rotate(135deg); animation-delay: 0.375s; }
.loader span:nth-child(5) { transform: rotate(180deg); animation-delay: 0.5s; }
.loader span:nth-child(6) { transform: rotate(225deg); animation-delay: 0.625s; }
.loader span:nth-child(7) { transform: rotate(270deg); animation-delay: 0.75s; }
.loader span:nth-child(8) { transform: rotate(315deg); animation-delay: 0.875s; }

@keyframes fade {
  0%   { opacity: 1; }
  100% { opacity: 0.15; }
}
</style>
