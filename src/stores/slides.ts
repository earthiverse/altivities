import { defineStore } from "pinia";
import type { WordList } from "./wordlist";

type Options = {
  en?: boolean;
  ja?: boolean;
};
export type EnglishSlide = {
  text: {
    en: string;
  };
  image?: string;
};
export type JapaneseSlide = {
  text: {
    ja: {
      kanji: string;
      hiragana: string;
    };
  };
  image?: string;
};
export type SlideData = EnglishSlide | JapaneseSlide;

export const useSlidesStore = defineStore({
  id: "slides",
  state: () => ({
    options: { en: true } as Options,
    slides: new Array<SlideData>(),
  }),
  actions: {
    addSlidesFromWordList(wordList: WordList): SlideData[] {
      for (const word of wordList) {
        if (this.options.en) {
          // Add English slide
          this.slides.push({
            image: word.image,
            text: {
              en: Array.isArray(word.en) ? word.en[0] : word.en,
            },
          });
        }
        if (this.options.ja) {
          // Add Japanese slide
          this.slides.push({
            image: word.image,
            text: {
              ja: {
                hiragana: Array.isArray(word.ja)
                  ? word.ja[0].hiragana
                  : word.ja.hiragana,
                kanji: Array.isArray(word.ja)
                  ? word.ja[0].kanji
                  : word.ja.kanji,
              },
            },
          });
        }
      }
      return this.slides;
    },
    removeAllSlides() {
      this.slides.splice(0, this.slides.length);
    },
    setOptionsFromURLSearchParams(): Options {
      const url = new URL(window.document.URL);
      console.log("url");
      console.log(url);
      const type = url.searchParams.get("type") as "en" | "en,ja" | "ja" | null;
      this.options = {
        en: type == undefined || type.includes("en"),
        ja: type?.includes("ja"),
      };
      return this.options;
    },
  },
});
