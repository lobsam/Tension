<template>
  <nav class="navbar sticky-top my-10" style="background: #256199">
    <div class="container-fluid">
      <a class="navbar-brand fs-6 text-uppercase fw-bold" style="color: white" href="/">
        PROJECT TENSION
      </a>
      <div class="nav-item text-uppercase fw-bold" href="#">
        <router-link to="/art"><MenuIcon /></router-link>
      </div>
    </div>
  </nav>
</template>
<script setup>
import MenuIcon from '../assets/MenuIcon.vue'
</script>

<style>
.navbar-brand {
  color: white;
}
</style>
