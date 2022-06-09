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
    resetMarked() {
      // Mark all cells false
      for (let i = 0; i < this.rows * this.cols; i++) {
        this.marked[i] = false;
      }
    },
    resetStore() {
      // Clear the bingo params
      updateURLParameter("bingo", undefined);

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
