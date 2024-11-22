<template>
  <nav class="navbar sticky-top my-10" style="background: #256199">
    <div class="container-fluid">
      <router-link class="navbar-brand fs-6 text-uppercase fw-bold" style="color: white" to="/"
        >PROJECT TENSION</router-link
      >
      <div class="nav-item text-uppercase fw-bold" href="#">
        <router-link to="/art" v-if="props.isHomePage"><MenuIcon /></router-link>
        <router-link to="/" v-if="!props.isHomePage"><HomeIcon /></router-link>
      </div>
    </div>
  </nav>
</template>
<script setup>
import MenuIcon from '../assets/MenuIcon.vue'
import HomeIcon from '../assets/HomeIcon.vue'
const props = defineProps({
  isHomePage: {
    type: Boolean,
    default: false
  }
})
</script>

<style>
.navbar-brand {
  color: white;
}
</style>
