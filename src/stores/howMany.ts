import { randomIntFromInterval } from "@/random";
import { defineStore } from "pinia";
import type { PluralWordList } from "./pluralWordlists";

export const useHowManyStore = defineStore({
  id: "how_many",
  state: () => ({
    cols: 5,
    rows: 5,
    cells: new Array<number>(),
    howManyQuestion: 0,
  }),
  actions: {
    checkAnswer(guess: number) {
      let actual = 0;
      for (const cell of this.cells) {
        if (this.howManyQuestion == cell) actual += 1;
      }
      return actual == guess;
    },
    randomize(words: PluralWordList) {
      const numWords = words.length;

      // Clear all cells
      this.cells.splice(0, this.cells.length);

      // Set every cell to a random word
      for (let i = 0; i < this.cols * this.rows; i++) {
        this.cells.push(randomIntFromInterval(0, numWords - 1));
      }

      // Set the question
      this.howManyQuestion = randomIntFromInterval(0, numWords - 1);
    },
  },
});
