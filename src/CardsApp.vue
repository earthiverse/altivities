<script setup lang="ts">
import CardsMenu from "@/components/CardsMenu.vue";
import LargeCard from "./components/LargeCardWithHandle.vue";
import { useWordListStore } from "@/stores/wordlist";
const wordlistStore = useWordListStore();
</script>

<template>
  <LargeCard :word="wordlistStore.getSelectedWordByIndex(0)" />
  <Suspense>
    <CardsMenu />
  </Suspense>
</template>

<style>
@import url("@/assets/style.css");
</style>
