<script setup lang="ts">
import CardsMenu from "@/components/CardsMenu.vue";
import LargeCard from "./components/LargeCard.vue";
import QRToggle from "./components/QRToggle.vue";
import { useWordListStore } from "@/stores/wordlist";
const wordlistStore = useWordListStore();
</script>

<template>
  <QRToggle />
  
  <Suspense>
    <CardsMenu />
  </Suspense>
</template>

<style>
@import url("@/assets/style.css");
</style>
