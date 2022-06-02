<script setup lang="ts">
import QRToggle from "./components/QRToggle.vue";
import {
  usePluralWordListStore,
  type PluralWord,
} from "@/stores/pluralWordlists";
import { useHowManyStore } from "@/stores/howMany";
import { randomFloatFromInterval, randomIntFromInterval } from "./random";
import type { StyleValue } from "vue";
const pluralWordlistStore = usePluralWordListStore();
const howManyStore = useHowManyStore();

// Assign a word to each cell
pluralWordlistStore.addWordsFromURLSearchParams().then(() => {
  howManyStore.cols = 5;
  howManyStore.rows = 5;
  howManyStore.randomize(pluralWordlistStore.words);
});

function getWord(cell: number): PluralWord | undefined {
  return pluralWordlistStore.getWordByIndex(cell);
}

function getQuestion(): PluralWord | undefined {
  return pluralWordlistStore.getWordByIndex(howManyStore.howManyQuestion);
}

function getRandomStyle(): StyleValue {
  const rotation = randomIntFromInterval(0, 2 * Math.PI);
  const scale = randomFloatFromInterval(0.5, 1);
  const offsetX = randomIntFromInterval(
    Math.cos(rotation) * 25,
    Math.sin(rotation) * 25
  );
  const offsetY = randomIntFromInterval(
    Math.cos(rotation) * 25,
    Math.sin(rotation) * 25
  );
  return {
    transform:
      `rotate(${rotation}rad) ` +
      `scale(${scale}) ` +
      `translate(${offsetX}%, ${offsetY}%)`,
    WebkitFilter: `drop-shadow(0 0 10px rgba(255, 255, 255, 5))`,
    filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 5))`,
  };
}

function checkAnswer() {
  // Get the guess
  const guess = Number.parseInt(
    (document.querySelector('input[type="number"]') as HTMLInputElement).value
  );
  if (howManyStore.checkAnswer(guess)) {
    // Do stuff
    alert("That's correct!");
    howManyStore.randomize(pluralWordlistStore.words);
  } else {
    // Do other stuff
    alert("Sorry, that's wrong.");
  }
}
</script>

<template>
  <QRToggle />

  <div class="top" :style="{ flexWrap: 'wrap' }">
    <div
      class="cell"
      v-for="(cell, index) in howManyStore.cells"
      :key="index"
      :style="{
        height: `calc((100% / ${howManyStore.rows}))`,
        width: `calc((100% / ${howManyStore.cols}))`,
      }"
    >
      <img
        v-if="getWord(cell)"
        :src="getWord(cell)?.singular.image"
        :style="getRandomStyle()"
      />
    </div>
  </div>

  <div class="bottom-menu">
    <div>How many</div>
    <div
      class="card"
      :style="{
        backgroundImage: `url(${getQuestion()?.plural.image})`,
      }"
    >
      <span class="text">{{ getQuestion()?.plural.en }}</span>
    </div>
    <div>?</div>
    <form class="form" @submit.prevent="checkAnswer">
      <input
        type="number"
        placeholder="__"
        min="0"
        :max="howManyStore.cells.length"
      />
      <input type="submit" value="Check!" />
    </form>
  </div>
</template>

<style>
@import url("@/assets/style.css");

.bottom-menu {
  align-items: center;
  font-family: "Schoolbell", cursive;
  font-size: 44pt;
  justify-content: center;
}

.card {
  align-content: center;
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: 1px solid #000;
  border-radius: 4pt;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-family: "Schoolbell", cursive;
  font-size: 14pt;
  height: 88pt;
  justify-content: flex-end;
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

.card .text {
  margin-bottom: 2pt;
  max-height: 36pt;
}

.cell {
  align-items: center;
  display: flex;
  justify-content: center;
}
.cell img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.form {
  margin-left: 44pt;
}

.form input {
  font-size: 44pt;
}

.form input[type="number"] {
  margin-right: 11pt;
  text-align: center;
  width: 88pt;
  -moz-appearance: textfield;
}

.top {
  border-bottom: 2pt solid #333;
  overflow: hidden;
}
</style>
