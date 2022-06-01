<script setup lang="ts">
import CardsMenu from "@/components/CardsMenu.vue";
import LargeCard from "./components/LargeCard.vue";
import QRToggle from "./components/QRToggle.vue";
import { useWordListStore } from "@/stores/wordlist";
const wordlistStore = useWordListStore();
</script>

<template>
  <QRToggle />
  <div class="display">
    <LargeCard :word="wordlistStore.getSelectedWordByIndex(0)" />
  </div>
  <Suspense>
    <CardsMenu />
  </Suspense>
</template>

<style>
@import url("@/assets/style.css");

.display {
  display: flex;
  height: calc(100vh - 100pt - 24px);
  width: 100%;
}
</style>
