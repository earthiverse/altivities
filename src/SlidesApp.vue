<script setup lang="ts">
import QRToggle from "./components/QRToggle.vue";
import SlidesDisplay from "./components/SlidesDisplay.vue";
</script>

<template>
  <QRToggle />
  <Suspense>
    <SlidesDisplay />
  </Suspense>
</template>

<style>
@import url("@/assets/style.css");

#app {
  height: 100%;
}
body,
html {
  height: 100%;
  width: calc(100% - 22pt);
  margin: auto;
}
</style>
