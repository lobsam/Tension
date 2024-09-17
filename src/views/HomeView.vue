<script setup>
import LandingView from './LandingView.vue'
import PurposeView from './PurposeView.vue'
import ThemeView from './ThemeView.vue'
import { useSheetStore } from '@/stores/googleSheets'

const store = useSheetStore()
console.log('hello: ', store.dataFromSheetUrl)
</script>

<template>
  <main>
    <LandingView :pages="store.dataFromSheetUrl.pages" />
    <PurposeView :pages="store.dataFromSheetUrl.pages" />
    <ThemeView :themes="store.dataFromSheetUrl.themes" />
  </main>
</template>
