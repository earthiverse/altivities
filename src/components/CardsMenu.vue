<script setup lang="ts">
import draggable from "vuedraggable";
import { useWordListStore } from "@/stores/wordlist";
const wordlistStore = useWordListStore();
await wordlistStore.addWordsFromURLSearchParams();
</script>

<template>
  <draggable
    animation="200"
    class="bottom-menu"
    easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
    group="words"
    handle=".handle"
    item-key="id"
    v-model="wordlistStore.unselected[0]"
  >
    <template #item="{ element: word }">
      <div
        class="card"
        :style="{
          backgroundImage: `url(${word.image})`,
        }"
      >
        <span class="material-symbols-outlined handle">drag_handle</span>
        <span class="text">{{
          Array.isArray(word.en) ? word.en[0] : word.en
        }}</span>
      </div>
    </template>
  </draggable>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Schoolbell&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.bottom-menu {
  box-sizing: border-box;
  display: flex;
  bottom: 0;
  gap: 8px;
  justify-content: start;
  overflow-x: scroll;
  padding: 8px;
  position: absolute;
  width: calc(100% - 16px);
}

.bottom-menu div {
  align-content: center;
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: 1px solid #000;
  border-radius: 4pt;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-family: "Schoolbell", cursive;
  font-size: 14pt;
  height: 88pt;
  justify-content: space-between;
  min-height: 88pt;
  min-width: 88pt;
  text-align: center;
  text-shadow: rgb(255, 255, 255) 2px 0px 0px,
    rgb(255, 255, 255) 1.75517px 0.958851px 0px,
    rgb(255, 255, 255) 1.0806px 1.68294px 0px,
    rgb(255, 255, 255) 0.141474px 1.99499px 0px,
    rgb(255, 255, 255) -0.832294px 1.81859px 0px,
    rgb(255, 255, 255) -1.60229px 1.19694px 0px,
    rgb(255, 255, 255) -1.97999px 0.28224px 0px,
    rgb(255, 255, 255) -1.87291px -0.701566px 0px,
    rgb(255, 255, 255) -1.30729px -1.51361px 0px,
    rgb(255, 255, 255) -0.421592px -1.95506px 0px,
    rgb(255, 255, 255) 0.567324px -1.91785px 0px,
    rgb(255, 255, 255) 1.41734px -1.41108px 0px,
    rgb(255, 255, 255) 1.92034px -0.558831px 0px;
  width: 88pt;
}

.bottom-menu div .handle {
  color: #666;
  display: flex;
  font-size: 24pt;
  height: 44pt;
  justify-content: center;
  width: 44pt;
}

.bottom-menu div .text {
  margin-bottom: 2pt;
  max-height: 36pt;
}
</style>
