<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <VApp id="inspire">
<NavBar/>
    <v-main>
      <RouterView/>
    </v-main>
    <Footer/>
  </VApp>
</template>

<style scoped>
</style> 