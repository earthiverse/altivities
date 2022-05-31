<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import { useWordListStore } from "@/stores/wordlist";
import { ref } from "vue";

type EnglishSlide = {
  text: {
    en: string;
  };
  image?: string;
};
type JapaneseSlide = {
  text: {
    ja: {
      kanji: string;
      hiragana: string;
    };
  };
  image?: string;
};
type SlideData = EnglishSlide | JapaneseSlide;

const { addWordsFromURLSearchParams } = useWordListStore();
const wordlist = await addWordsFromURLSearchParams();

// Make the slides
const slides = ref<SlideData[]>([]);
const params = new URLSearchParams(window.location.search);
const type = params.get("type") as "en" | "en+ja" | "ja" | null;
for (const word of wordlist) {
  if (!type || type.includes("en")) {
    // Add English slide
    slides.value.push({
      image: word.image,
      text: {
        en: Array.isArray(word.en) ? word.en[0] : word.en,
      },
    });
  }
  if (type?.includes("ja")) {
    // Add Japanese slide
    slides.value.push({
      image: word.image,
      text: {
        ja: {
          hiragana: Array.isArray(word.ja)
            ? word.ja[0].hiragana
            : word.ja.hiragana,
          kanji: Array.isArray(word.ja) ? word.ja[0].kanji : word.ja.kanji,
        },
      },
    });
  }
}

// Add navigation by arrow keys
let myCarousel = ref<any>(null); // TODO: The Carousel we use doesn't have typings (yet?)...
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      myCarousel.value.prev();
      break;
    case "ArrowRight":
      myCarousel.value.next();
      break;
  }
});
</script>

<template>
  <Carousel :items-to-show="1.1" :wrap-around="true" ref="myCarousel">
    <template #slides>
      <Slide v-for="(slide, index) in slides" :key="index">
        <div
          class="carousel__item"
          :style="{
            backgroundImage: `url(${slide.image})`,
          }"
        >
          <ruby v-if="(slide as EnglishSlide).text.en" class="en">
            {{ (slide as EnglishSlide).text.en }}
          </ruby>
          <ruby v-else-if="(slide as JapaneseSlide).text.ja" class="ja">
            {{ (slide as JapaneseSlide).text.ja.kanji }}<rt>{{ (slide as JapaneseSlide).text.ja.hiragana }}</rt>
          </ruby>
        </div>
      </Slide>
    </template>
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Schoolbell&display=swap");

body,
html {
  overflow-x: hidden;
}

.carousel {
  height: 100%;
}

.carousel__item {
  align-items: flex-end;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: 4pt solid #000;
  border-radius: 44pt;
  color: #000;
  display: flex;
  font-family: "Schoolbell", cursive;
  font-size: min(8vh, 8vw);
  height: 100%;
  justify-content: center;
  overflow: hidden;
  padding: 0 0 8pt 0;
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

.carousel__slide {
  padding: 10px;
}

.carousel__slide > .carousel__item {
  transform: scale(1);
  opacity: 0.25;
  transition: 0.5s;
}
.carousel__slide--visible > .carousel__item {
  opacity: 1;
  transform: rotateY(0);
}

.carousel__prev,
.carousel__next {
  background-color: #fff;
  box-sizing: content-box;
  border: 5px solid #000;
}

.carousel__prev {
  left: 30pt;
}

.carousel__next {
  right: 30pt;
}

.carousel__icon {
  fill: #000;
}

.carousel__track {
  height: 100%;
}

.carousel__viewport {
  height: calc(100% - 44pt);
}
</style>
