<script setup>
import LandingView from './LandingView.vue'
import PurposeView from './PurposeView.vue'
import ThemeView from './ThemeView.vue'
import { useSheetStore } from '@/stores/googleSheets'
import NarativeView from './NarativeView.vue'
import Footer from '../components/Footer.vue'
import Header from '@/components/Header.vue'

const store = useSheetStore()
console.log('hello: ', store.dataFromSheetUrl)
</script>

<template>
  <main>
    <Header :isHomePage="true" />
    <LandingView :pages="store.dataFromSheetUrl.pages" />
    <PurposeView :pages="store.dataFromSheetUrl.pages" />
    <ThemeView :themes="store.dataFromSheetUrl.themes" />
    <NarativeView :pages="store.dataFromSheetUrl.pages" />
    <Footer />
  </main>
</template>
