<template>
  <div class="slot" @click="marked = !marked">
    <img
      src="/assets/images/bingo_circle.png"
      :style="{
        opacity: marked ? 0.6 : 0,
      }"
    />
    <StaticCard
      :style="{
        backgroundImage: word.image == undefined ? '' : `url(${word.image})`,
      }"
      :text="Array.isArray(word.en) ? word.en[0] : word.en"
    />
  </div>
</template>

<script lang="ts">
import { useWordListStore } from "@/store/wordlist";
import { v4 } from "uuid";
import { defineComponent, ref } from "vue";
import StaticCard from "./StaticCard.vue";

const wordListStore = useWordListStore();

export default defineComponent({
  components: {
    StaticCard,
  },
  name: "BingoCardSlot",
  props: {
    name: String,
  },
  data() {
    const word = wordListStore.getSlotByName(this.name ?? v4()).list[0];
    const marked = ref(false);
    return {
      marked: marked,
      word: word,
    };
  },
});
</script>

<style scoped>
.slot {
  overflow: hidden;
}
</style>
