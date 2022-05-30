<script setup lang="ts">
import { useWordListStore } from "@/stores/wordlist";
const { addWordsFromURLSearchParams } = useWordListStore();
const wordlist = await addWordsFromURLSearchParams();
</script>

<template>
  <div v-if="wordlist">
    <div v-for="(word, index) in wordlist" :key="index">
      {{ Array.isArray(word.en) ? word.en[0] : word.en }}
    </div>
  </div>
</template>
