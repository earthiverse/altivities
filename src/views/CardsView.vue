<template>
  <BottomArea>
    <Draggable
      v-model="store.unselected"
      class="cards"
      handle=".handle"
      group="cards"
      item-key="id"
    >
      <template #item="{ element }">
        <DraggableCard
          :style="{
            backgroundImage:
              element.image == undefined ? '' : `url(${element.image})`,
          }"
          :text="Array.isArray(element.en) ? element.en[0] : element.en"
        />
      </template>
    </Draggable>
  </BottomArea>
</template>

<script lang="ts">
import Draggable from "vuedraggable";
import { defineComponent } from "vue";
import { useWordListStore } from "@/store/wordlist";
import BottomArea from "@/components/BottomArea.vue";
import DraggableCard from "@/components/DraggableCard.vue";

const wordListStore = useWordListStore();

async function getWordLists() {
  await wordListStore.addWordLists({
    wordLists: [
      "https://altivities.earthiverse.ca/wordlists/General/colors.json",
    ],
  });
  console.log(wordListStore.unselected.length);
  for (const word of wordListStore.unselected) {
    console.log(word.id);
  }
}
if (wordListStore.unselected.length == 0) getWordLists();

export default defineComponent({
  name: "HomeView",
  components: {
    BottomArea,
    Draggable,
    DraggableCard,
  },
  data() {
    return {
      store: wordListStore,
    };
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@400&display=swap");

.card {
  border: 1px solid #000;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: "Lexend", sans-serif;
  height: 88pt;
  width: 88pt;
}

#app {
  display: flex;
}
</style>

<style scoped>
.cards {
  display: flex;
  gap: 5px;
}
</style>
