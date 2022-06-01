import { defineStore } from "pinia";
import type { WordList } from "./wordlist";

type Options = ("en" | "ja" | "img")[];
export type SlideData =
  | {
      type: "en";
      text: {
        en: string;
      };
      image?: string;
    }
  | {
      type: "ja";
      text: {
        ja: {
          kanji: string;
          hiragana: string;
        };
      };
      image?: string;
    }
  | {
      type: "img";
      image?: string;
    };

export const useSlidesStore = defineStore({
  id: "slides",
  state: () => ({
    options: ["en"] as Options,
    slides: new Array<SlideData>(),
  }),
  actions: {
    addSlidesFromWordList(wordList: WordList): SlideData[] {
      for (const word of wordList) {
        for (const option of this.options) {
          if (option == "en") {
            // Make an English slide
            this.slides.push({
              type: "en",
              image: word.image,
              text: {
                en: Array.isArray(word.en) ? word.en[0] : word.en,
              },
            });
          } else if (option == "ja") {
            // Made a Japanese slide
            this.slides.push({
              type: "ja",
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
          } else if (option == "img") {
            // Make an image slide
            this.slides.push({
              type: "img",
              image: word.image,
            });
          }
        }
      }
      return this.slides;
    },
    removeAllSlides() {
      this.slides.splice(0, this.slides.length);
    },
    setOptionsFromURLSearchParams(): Options {
      const url = new URL(window.document.URL);
      const options = url.searchParams.get("type")?.split(",");
      if (options) {
        // Remove old options
        this.options.splice(0, this.options.length);
        for (const option of options) {
          if (option !== "en" && option !== "ja" && option !== "img") continue;
          this.options.push(option);
        }
      }
      return this.options;
    },
  },
});
