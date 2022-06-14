<script setup lang="ts">
import draggable from "vuedraggable";
import { useWordListStore } from "@/stores/wordlist";

const wordlistStore = useWordListStore();

// Logic to swap the current card (if one exists)
type OnAddEvent = {
  newIndex: number;
  oldIndex: number;
};
const onAdd = (data: OnAddEvent) => {
  // Move the current card back to the list
  if (wordlistStore.selected[0].length > 1) {
    const word = wordlistStore.selected[0].splice(data.newIndex ? 0 : 1, 1)[0];
    wordlistStore.unselected[0].push(word);
  }
};
</script>

<template>
  <draggable
    @add="onAdd"
    animation="200"
    class="large-card"
    easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
    group="words"
    item-key="id"
    v-model="wordlistStore.selected[0]"
  >
    <template #item="{ element: word }">
      <div
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
.sortable-ghost {
  opacity: 0.5;
}

.large-card {
  aspect-ratio: 1 / 1;
  border: 2pt dashed #000;
  border-radius: 44pt;
  height: min(100%, 100vw);
  margin: auto;
  overflow: hidden;
}

.large-card div {
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-family: "Schoolbell", cursive;
  font-size: min(8vh, 8vw);
  height: 100%;
  justify-content: flex-end;
  text-shadow: rgb(255, 255, 255) 6px 0px 0px,
    rgb(255, 255, 255) 5.91686px 0.995377px 0px,
    rgb(255, 255, 255) 5.66974px 1.96317px 0px,
    rgb(255, 255, 255) 5.2655px 2.87655px 0px,
    rgb(255, 255, 255) 4.71532px 3.71022px 0px,
    rgb(255, 255, 255) 4.03447px 4.44106px 0px,
    rgb(255, 255, 255) 3.24181px 5.04883px 0px,
    rgb(255, 255, 255) 2.35931px 5.51667px 0px,
    rgb(255, 255, 255) 1.41143px 5.83163px 0px,
    rgb(255, 255, 255) 0.424423px 5.98497px 0px,
    rgb(255, 255, 255) -0.574341px 5.97245px 0px,
    rgb(255, 255, 255) -1.55719px 5.79441px 0px,
    rgb(255, 255, 255) -2.49688px 5.45579px 0px,
    rgb(255, 255, 255) -3.36738px 4.96596px 0px,
    rgb(255, 255, 255) -4.14455px 4.33852px 0px,
    rgb(255, 255, 255) -4.80686px 3.59083px 0px,
    rgb(255, 255, 255) -5.33596px 2.74364px 0px,
    rgb(255, 255, 255) -5.71718px 1.8204px 0px,
    rgb(255, 255, 255) -5.93995px 0.84672px 0px,
    rgb(255, 255, 255) -5.99811px -0.150428px 0px,
    rgb(255, 255, 255) -5.89004px -1.14341px 0px,
    rgb(255, 255, 255) -5.61874px -2.1047px 0px,
    rgb(255, 255, 255) -5.19172px -3.00766px 0px,
    rgb(255, 255, 255) -4.62082px -3.82727px 0px,
    rgb(255, 255, 255) -3.92186px -4.54082px 0px,
    rgb(255, 255, 255) -3.11421px -5.12852px 0px,
    rgb(255, 255, 255) -2.22026px -5.57409px 0px,
    rgb(255, 255, 255) -1.26477px -5.86518px 0px,
    rgb(255, 255, 255) -0.274238px -5.99373px 0px,
    rgb(255, 255, 255) 0.723898px -5.95617px 0px,
    rgb(255, 255, 255) 1.70197px -5.75355px 0px,
    rgb(255, 255, 255) 2.63288px -5.39147px 0px,
    rgb(255, 255, 255) 3.49082px -4.87998px 0px,
    rgb(255, 255, 255) 4.25202px -4.23324px 0px,
    rgb(255, 255, 255) 4.89538px -3.46919px 0px,
    rgb(255, 255, 255) 5.40307px -2.60899px 0px,
    rgb(255, 255, 255) 5.76102px -1.67649px 0px,
    rgb(255, 255, 255) 5.95932px -0.697531px 0px;
  width: 100%;
}

.large-card div .handle {
  display: none;
}

.large-card div .text {
  margin-bottom: 4pt;
}
</style>
