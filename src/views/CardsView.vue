<template>
  <TopArea>
    <CardSlot
      animation="200"
      easing="cubic-bezier(0.33, 1, 0.68, 1)"
      name="large-card"
    ></CardSlot>
  </TopArea>
  <BottomArea>
    <Draggable
      animation="200"
      v-model="unselected.list"
      easing="cubic-bezier(0.33, 1, 0.68, 1)"
      handle=".handle"
      group="cards"
      id="unselected"
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
import TopArea from "@/components/TopArea.vue";
import CardSlot from "@/components/CardSlot.vue";
import DraggableCard from "@/components/DraggableCard.vue";

const wordListStore = useWordListStore();

async function getWordLists() {
  await wordListStore.addWordLists({
    wordLists: [
      "https://altivities.earthiverse.ca/wordlists/General/colors.json",
    ],
  });
}
if (wordListStore.getSlotByName("unselected").list.length == 0) getWordLists();

export default defineComponent({
  name: "HomeView",
  components: {
    BottomArea,
    TopArea,
    Draggable,
    DraggableCard,
    CardSlot,
  },
  data() {
    return {
      store: wordListStore,
      unselected: wordListStore.getSlotByName("unselected"),
    };
  },
});
</script>

<style>
body,
html,
#app {
  overflow: hidden;
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@400&display=swap");
#unselected {
  display: flex;
  gap: 5px;
  height: calc(88pt + 15px);
  justify-content: flex-start;
  overflow-x: scroll;
}

#large-card {
  aspect-ratio: 1 / 1;
  background-color: white;
  border: 2px dashed #000;
  border-radius: 10px;
  height: min(100%, 100vw);
}

::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}

::-webkit-scrollbar-track {
  background: white;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>

<style>
.bottom .card {
  border: 1px solid #000;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: "Lexend", sans-serif;
  height: 88pt;
  width: 88pt;
  min-width: 88pt;
}

#large-card .card {
  height: 100%;
  width: 100%;
}

#large-card .card,
#large-card .card .handle {
  font-size: min(10vw, 10vh);
}

#large-card .card {
  font-family: "Lexend", sans-serif;
}
</style>
