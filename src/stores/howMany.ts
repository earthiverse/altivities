import { randomIntFromInterval, randomTransformStyle } from "@/random";
import { defineStore } from "pinia";
import type { StyleValue } from "vue";
import type { PluralWord, PluralWordList } from "./pluralWordList";

export type HowManyCellData = {
  index: number;
  selected: boolean;
  style: StyleValue;
  word: PluralWord;
};

export const useHowManyStore = defineStore({
  id: "how_many",
  state: () => ({
    cols: 5,
    rows: 5,
    cells: new Array<HowManyCellData>(),
    hidden: false,
    howManyQuestion: 0,
  }),
  actions: {
    checkAnswer(guess: number) {
      let actual = 0;
      for (const cell of this.cells) {
        if (this.howManyQuestion == cell.index) actual += 1;
      }
      return actual == guess;
    },
    randomize(words: PluralWordList) {
      const numWords = words.length;

      // Clear all cells
      this.cells.splice(0, this.cells.length);

      // Set every cell to a random word
      for (let i = 0; i < this.cols * this.rows; i++) {
        const randomIndex = randomIntFromInterval(0, numWords - 1);
        this.cells.push({
          index: randomIndex,
          selected: false,
          style: randomTransformStyle(),
          word: words[randomIndex],
        });
      }

      // Unhide
      this.hidden = false;

      // Set the question
      this.howManyQuestion = randomIntFromInterval(0, numWords - 1);
    },
    setSettingsFromURLSearchParams() {
      const params = new URLSearchParams(window.location.search);

      const rows = params.get("rows");
      if (rows) this.rows = Number.parseInt(rows);

      const cols = params.get("cols");
      if (cols) this.cols = Number.parseInt(cols);
    },
  },
});
