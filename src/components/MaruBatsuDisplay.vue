<script setup lang="ts">
import { randomIntFromInterval } from "@/random";
import { ref } from "vue";
</script>

<script lang="ts">
const CORRECT_IMAGES = [
  "/assets/images/correct/bear.png",
  "/assets/images/correct/cat.png",
  "/assets/images/correct/dog.png",
  "/assets/images/correct/man.png",
  "/assets/images/correct/rabbit.png",
  "/assets/images/correct/woman.png",
];

const INCORRECT_IMAGES = [
  "/assets/images/incorrect/bear.png",
  "/assets/images/incorrect/cat.png",
  "/assets/images/incorrect/dog.png",
  "/assets/images/incorrect/man.png",
  "/assets/images/incorrect/rabbit.png",
  "/assets/images/incorrect/woman.png",
];

let currentCorrectImage = ref(0);
let currentIncorrectImage = ref(0);

export function showRandomCorrect() {
  const el = document.getElementById("maru_batsu_correct") as HTMLDivElement;
  if (el.classList.contains("fadeInAndOut")) return; // Already mid-animation
  currentCorrectImage.value = randomIntFromInterval(
    0,
    CORRECT_IMAGES.length - 1
  );
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove("fadeInAndOut");
      currentIncorrectImage.value = randomIntFromInterval(
        0,
        INCORRECT_IMAGES.length - 1
      );
    },
    true
  );
  el.classList.add("fadeInAndOut");
}

export function showRandomIncorrect() {
  const el = document.getElementById("maru_batsu_incorrect") as HTMLDivElement;
  if (el.classList.contains("fadeInAndOut")) return; // Already mid-animation
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove("fadeInAndOut");
      currentIncorrectImage.value = randomIntFromInterval(
        0,
        INCORRECT_IMAGES.length - 1
      );
    },
    true
  );
  el.classList.add("fadeInAndOut");
}
</script>

<template>
  <div id="maru_batsu_correct" class="correct">
    <img
      id="maru_batsu_correct_img"
      :src="CORRECT_IMAGES[currentCorrectImage]"
    />
  </div>
  <div id="maru_batsu_incorrect" class="incorrect">
    <img
      id="maru_batsu_incorrect_img"
      :src="INCORRECT_IMAGES[currentIncorrectImage]"
    />
  </div>
</template>

<style scoped>
.correct {
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  left: 0;
  opacity: 0;
  position: absolute;
  width: 50%;
  z-index: -9999;
}

.correct img {
  object-fit: contain;
}

.incorrect {
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  opacity: 0;
  position: absolute;
  right: 0;
  width: 50%;
  z-index: -9999;
}

.incorrect img {
  object-fit: contain;
}

.fadeInAndOut {
  animation: fade 2s linear;
  z-index: 10;
}

@keyframes fade {
  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}
</style>
