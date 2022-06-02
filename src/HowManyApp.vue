<script setup lang="ts">
import QRToggle from "./components/QRToggle.vue";
import {
  usePluralWordListStore,
  type PluralWord,
} from "@/stores/pluralWordlists";
import { useHowManyStore, type HowManyCellData } from "@/stores/howMany";
const pluralWordlistStore = usePluralWordListStore();
const howManyStore = useHowManyStore();

// Assign a word to each cell
pluralWordlistStore.addWordsFromURLSearchParams().then(() => {
  howManyStore.cols = 5;
  howManyStore.rows = 5;
  howManyStore.randomize(pluralWordlistStore.words);
});

const numberSounds: { [T in number]: string } = {
  1: "/assets/audio/numbers/1.mp3",
  2: "/assets/audio/numbers/2.mp3",
  3: "/assets/audio/numbers/3.mp3",
  4: "/assets/audio/numbers/4.mp3",
  5: "/assets/audio/numbers/5.mp3",
  6: "/assets/audio/numbers/6.mp3",
  7: "/assets/audio/numbers/7.mp3",
  8: "/assets/audio/numbers/8.mp3",
  9: "/assets/audio/numbers/9.mp3",
  10: "/assets/audio/numbers/10.mp3",
  11: "/assets/audio/numbers/11.mp3",
  12: "/assets/audio/numbers/12.mp3",
  13: "/assets/audio/numbers/13.mp3",
  14: "/assets/audio/numbers/14.mp3",
  15: "/assets/audio/numbers/15.mp3",
  16: "/assets/audio/numbers/16.mp3",
  17: "/assets/audio/numbers/17.mp3",
  18: "/assets/audio/numbers/18.mp3",
  19: "/assets/audio/numbers/19.mp3",
  20: "/assets/audio/numbers/20.mp3",
};

function getQuestion(): PluralWord | undefined {
  return pluralWordlistStore.getWordByIndex(howManyStore.howManyQuestion);
}

let numClickedOK = 0;
function checkClick(cell: HowManyCellData) {
  if (cell.selected) return; // They've already clicked it before
  const qIndex = howManyStore.howManyQuestion;
  if (cell.index == qIndex) {
    // They clicked on the correct cell
    cell.selected = true;
    new Audio("/assets/audio/sfx/correct.mp3").play();
    numClickedOK += 1;
    if (numberSounds[numClickedOK])
      new Audio(numberSounds[numClickedOK]).play();
  } else {
    new Audio("/assets/audio/sfx/incorrect.mp3").play();
  }
}

function checkAnswer() {
  // Get the guess
  const input = document.querySelector(
    'input[type="number"]'
  ) as HTMLInputElement;
  const answer = Number.parseInt(input.value);
  if (howManyStore.checkAnswer(answer)) {
    // Do stuff
    alert("That's correct!");
    input.value = "";
    numClickedOK = 0;
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
        opacity: cell.selected ? 0.5 : 1,
        width: `calc((100% / ${howManyStore.cols}))`,
      }"
    >
      <img
        :src="cell.word.singular.image"
        :style="cell.style"
        @click="checkClick(cell)"
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
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  font-family: "Schoolbell", cursive;
  height: 88pt;
  justify-content: center;
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
}

.cell {
  align-items: center;
  display: flex;
  justify-content: center;
  transition: opacity 1s;
}
.cell img {
  height: 100%;
  object-fit: contain;
  width: 100%;
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
