import { updateURLParameter } from "@/url";
import { defineStore } from "pinia";
import type { WordList } from "./wordlist";

export const useBingoStore = defineStore({
  id: "bingo",
  state: () => ({
    cellSize: 0,
    cols: 3,
    rows: 3,
    selected: new Array<WordList>(),
    marked: new Array<boolean>(),
  }),
  actions: {
    calculateCellSize(): number {
      const width = window.innerWidth - 16;
      const height = window.innerHeight - 160;

      this.cellSize = Math.min(width / this.cols, height / this.rows);

      return this.cellSize;
    },
    countBingos(): number {
      let count = 0;

      /**
       * Count row bingos
       * ---
       * XXX
       * ---
       */
      if (this.cols > 1) {
        // Only count rows if there's more than one column
        for (let row = 0; row < this.rows; row++) {
          let bingo = true;
          for (let col = 0; col < this.cols; col++) {
            const index = row * this.cols + col;
            if (!this.marked[index]) {
              bingo = false;
              break;
            }
          }
          if (bingo) count += 1;
        }
      }

      /**
       * Count column bingos
       * -X-
       * -X-
       * -X-
       */
      if (this.rows > 1) {
        // Only count bingos if there's more than 1 row
        for (let col = 0; col < this.cols; col++) {
          let bingo = true;
          for (let row = 0; row < this.rows; row++) {
            const index = row * this.cols + col;
            if (!this.marked[index]) {
              bingo = false;
              break;
            }
          }
          if (bingo) count += 1;
        }
      }

      /**
       * Count diagonal bingos
       * --X
       * -X-
       * X--
       */
      if (this.cols == this.rows) {
        // Only count diagonals if the bingo box is a square
        let bingo1 = true; // 1 is for the '\' diagonal
        let bingo2 = true; // 2 is for the '/' diagonal
        for (let i = 0; i < this.cols; i++) {
          const index1 = i * this.cols + i;
          const index2 = (i + 1) * this.cols - (i + 1);
          if (!this.marked[index1]) bingo1 = false;
          if (!this.marked[index2]) bingo2 = false;
        }
        if (bingo1) count += 1;
        if (bingo2) count += 1;
      }

      return count;
    },
    resetMarked() {
      // Mark all cells false
      this.marked.splice(0, this.marked.length);
      for (let i = 0; i < this.rows * this.cols; i++) {
        this.marked.push(false);
      }
    },
    resetStore() {
      // Clear the bingo params
      updateURLParameter("bingo", undefined);

      this.marked.splice(0, this.marked.length);
      for (let i = 0; i < this.rows * this.cols; i++) {
        // Clear all selected cells
        const arr = this.selected[i];
        arr.splice(0, arr.length);

        // Mark all cells false
        this.marked[i] = false;
      }
    },
    setSettingsFromURLSearchParams() {
      const params = new URLSearchParams(window.location.search);

      const rows = params.get("rows");
      if (rows) this.rows = Number.parseInt(rows);

      const cols = params.get("cols");
      if (cols) this.cols = Number.parseInt(cols);

      for (let i = 0; i < this.rows * this.cols; i++) {
        this.selected.push([]);
        this.marked[i] = false;
      }

      this.calculateCellSize();
    },
  },
});
