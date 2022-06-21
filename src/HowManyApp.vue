<script setup lang="ts">
import QRToggle from "./components/QRToggle.vue";
import HowManySettingsToggle from "./components/HowManySettingsToggle.vue";
import MaruBatsuDisplay, {
  showRandomCorrect,
  showRandomIncorrect,
} from "./components/MaruBatsuDisplay.vue";
import {
  usePluralWordListStore,
  type PluralWord,
} from "@/stores/pluralWordList";
import { useHowManyStore, type HowManyCellData } from "@/stores/howMany";
const pluralWordlistStore = usePluralWordListStore();
const howManyStore = useHowManyStore();

// Assign a word to each cell
pluralWordlistStore.addWordsFromURLSearchParams().then(() => {
  howManyStore.setSettingsFromURLSearchParams();
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
  30: "/assets/audio/numbers/30.mp3",
  40: "/assets/audio/numbers/40.mp3",
  50: "/assets/audio/numbers/50.mp3",
  60: "/assets/audio/numbers/60.mp3",
  70: "/assets/audio/numbers/70.mp3",
  80: "/assets/audio/numbers/80.mp3",
  90: "/assets/audio/numbers/90.mp3",
};

function getQuestion(): PluralWord | undefined {
  return pluralWordlistStore.getWordByIndex(howManyStore.howManyQuestion);
}

let numClickedOK = 0;
function checkClick(cell: HowManyCellData) {
  if (howManyStore.hidden) return; // We're hidden, don't do anything
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

function toggleHide() {
  howManyStore.hidden = !howManyStore.hidden;
}

function checkAnswer() {
  // Get the guess
  const answerInput = document.querySelector(
    'input[name="answer"]'
  ) as HTMLInputElement;
  const answer = Number.parseInt(answerInput.value);

  if (howManyStore.checkAnswer(answer)) {
    // Do stuff
    new Audio("/assets/audio/sfx/complete.mp3").play();
    showRandomCorrect();
    howManyStore.hidden = true;
    setTimeout(() => {
      answerInput.value = "";
      numClickedOK = 0;
      howManyStore.randomize(pluralWordlistStore.words);
    }, 2000);
  } else {
    // Do other stuff
    new Audio("/assets/audio/sfx/incorrect.mp3").play();
    showRandomIncorrect();
  }
}
</script>

<template>
  <QRToggle />
  <HowManySettingsToggle />
  <span
    v-if="howManyStore.hidden"
    @click="toggleHide"
    class="material-symbols-outlined button button-top button-right-1"
  >
    image
  </span>
  <span
    v-else
    @click="toggleHide"
    class="material-symbols-outlined button button-top button-right-1"
  >
    hide_image
  </span>

  <MaruBatsuDisplay />

  <div id="top" :style="{ flexWrap: 'wrap' }">
    <div
      class="cell"
      v-for="(cell, index) in howManyStore.cells"
      :key="index"
      :style="{
        height: `calc((100% / ${howManyStore.rows}))`,
        opacity: howManyStore.hidden ? 0 : cell.selected ? 0.5 : 1,
        width: `calc((100% / ${howManyStore.cols}))`,
      }"
      @click="checkClick(cell)"
    >
      <img :src="cell.word.singular.image" :style="cell.style" />
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
        min="0"
        name="answer"
        placeholder="__"
        required
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
  background-color: #fff;
  font-family: "Schoolbell", cursive;
  font-size: 44pt;
  justify-content: center;
  z-index: 10;
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
  overflow: hidden;
}
.cell img {
  height: 100%;
  object-fit: contain;
  width: 100%;
  z-index: -1000;
}

.form {
  margin-left: 44pt;
}

form,
form input {
  font-size: 44pt;
}

form input[type="number"] {
  margin-right: 11pt;
  text-align: center;
  width: 88pt;
  -moz-appearance: textfield;
}

#top {
  border-bottom: 2pt solid #333;
  overflow: hidden;
}
</style>
