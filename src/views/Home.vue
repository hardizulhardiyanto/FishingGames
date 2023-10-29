<template>
  <div class="hero">
    <StartingApp />
  </div>
</template>

<script setup>
import StartingApp from "@/components/StartingApp.vue";
</script>

<style scoped>
.hero {
  height: 100vh;
  background-image: url("../assets/letsgofishing_thumb.png");
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
