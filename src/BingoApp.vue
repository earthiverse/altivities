<script setup lang="ts">
import draggable from "vuedraggable";
import CardsMenu from "@/components/CardsMenu.vue";
import QRToggle from "@/components/QRToggle.vue";
import { useBingoStore } from "@/stores/bingo";
import { useWordListStore } from "@/stores/wordlist";
import { onMounted, ref, watch, type Ref } from "vue";
import { updateURLParameter } from "./url";
import { randomIntFromInterval } from "./random";

const wordlistStore = useWordListStore();
const bingoStore = useBingoStore();
watch(wordlistStore.wordLists, () => {
  // Word lists are loaded, set the cards if we have some selected already
  const params = new URLSearchParams(window.location.search);
  const bingo = params.get("bingo");
  if (bingo) {
    const wordIndexes = bingo.split(",");
    for (let i = 0; i < wordIndexes.length; i++) {
      const wordIndexString = wordIndexes[i];
      if (wordIndexString === "") continue;
      const wordIndex = Number.parseInt(wordIndexString);
      const word = wordlistStore.selectWord(wordIndex);
      if (!word) continue;
      const arr = bingoStore.selected[i];
      if (!arr) break; // More words are defined than there are cells
      arr.push(word);
    }
  }
  checkReady();
});

bingoStore.setSettingsFromURLSearchParams();

function getBorderWidths(row: number, col: number, size = 2) {
  const borderWidths = [size, size, size, size];

  if (row == 1 && bingoStore.rows !== 1) {
    // First row -> make the top border larger
    borderWidths[0] *= 2;
  } else if (row == bingoStore.rows && bingoStore.rows !== 1) {
    // Last row -> make the bottom border larger
    borderWidths[2] *= 2;
  }

  if (col == 1 && bingoStore.cols !== 1) {
    // First col -> make the left border larger
    borderWidths[3] *= 2;
  } else if (col == bingoStore.cols && bingoStore.cols !== 1) {
    // Last col -> make the right border larger
    borderWidths[1] *= 2;
  }

  return borderWidths.join("px ") + "px";
}

function resetBingo() {
  bingoStore.resetStore();
  wordlistStore.resetStore();
  checkReady();
}

function shuffleBingo() {
  resetBingo();

  // Select a random word for each cell
  for (let i = 0; i < bingoStore.cols * bingoStore.rows; i++) {
    const randIndex = randomIntFromInterval(
      0,
      wordlistStore.unselected[0].length - 1
    );
    const word = wordlistStore.unselected[0].splice(randIndex, 1)[0];
    if (word == undefined) return; // We don't have enough words to fill all the cells
    bingoStore.selected[i].push(word);
  }

  checkReady();
}

const ready = ref(false);
function checkReady() {
  // Update the URL to match the words selected
  const bingo = [];
  let r = true;
  let any = false;
  for (let i = 0; i < bingoStore.cols * bingoStore.rows; i++) {
    const id = bingoStore.selected[i][0]?.id;
    if (id === undefined) r = false;
    else any = true;
    bingo.push(id ?? "");
  }
  if (any) {
    updateURLParameter("bingo", bingo.join(","));
  } else {
    updateURLParameter("bingo", undefined);
  }
  ready.value = r;
  return r;
}

const mode: Ref<"play" | "set" | "teach"> = ref("set");
function playBingo() {
  bingoStore.resetMarked();
  if (checkReady()) mode.value = "play";
}

function setupBingo() {
  mode.value = "set";
}

function toggleMark(index: number) {
  bingoStore.marked[index] = !bingoStore.marked[index];
}

// Logic to swap the current card (if one exists)
type OnAddEvent = {
  from: HTMLDivElement;
  newIndex: number;
  oldIndex: number;
  to: HTMLDivElement;
};
const onAdd = (data: OnAddEvent) => {
  const num_from = Number.parseInt(data.from.id.split("_")[1]);
  const num_to = Number.parseInt(data.to.id.split("_")[1]);

  if (bingoStore.selected[num_to].length > 1) {
    // We already had a card in this cell, move the other one back
    const word = bingoStore.selected[num_to].splice(
      data.newIndex ? 0 : 1,
      1
    )[0];
    if (Number.isNaN(num_from)) {
      // Other card came from the menu
      wordlistStore.unselected[0].push(word);
    } else {
      // Other card came from another cell
      bingoStore.selected[num_from].push(word);
    }
  }

  checkReady();
};

onMounted(() => {
  window.addEventListener("resize", () => {
    bingoStore.calculateCellSize();
  });
});
</script>

<template>
  <template v-if="mode == 'set'">
    <QRToggle />

    <div
      class="top"
      :style="{
        width: `${bingoStore.cellSize * bingoStore.cols}px`,
      }"
    >
      <div class="bingo">
        <template v-for="row in bingoStore.rows">
          <draggable
            @add="onAdd"
            @remove="checkReady"
            animation="200"
            class="bingo-cell"
            easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
            group="words"
            :id="`cell_${(row - 1) * bingoStore.cols + (col - 1)}`"
            item-key="id"
            v-model="
              bingoStore.selected[(row - 1) * bingoStore.cols + (col - 1)]
            "
            v-for="col in bingoStore.cols"
            :key="row * bingoStore.cols + col"
            :style="{
              borderWidth: getBorderWidths(row, col, 2),
              height: bingoStore.cellSize + 'px',
              width: bingoStore.cellSize + 'px',
            }"
          >
            <template #item="{ element: word }">
              <div
                class="card"
                :style="{
                  backgroundImage: `url(${word.image})`,
                }"
              >
                <span class="material-symbols-outlined handle"
                  >drag_handle</span
                >
                <span
                  class="text"
                  :style="{
                    'font-size': bingoStore.cellSize / 10 + 'px',
                  }"
                  >{{ Array.isArray(word.en) ? word.en[0] : word.en }}</span
                >
              </div>
            </template>
          </draggable>
        </template>
      </div>
    </div>
    <span
      @click="resetBingo"
      class="button button-bottom button-left-1 restart-button material-symbols-outlined"
    >
      restart_alt
    </span>
    <span
      @click="shuffleBingo"
      class="button button-bottom button-left-2 shuffle-button material-symbols-outlined"
    >
      shuffle
    </span>
    <span
      @click="playBingo"
      class="button button-bottom button-right-1 ready-button material-symbols-outlined"
      :style="{
        color: ready ? 'green' : 'black',
        cursor: ready ? 'pointer' : 'not-allowed',
        opacity: ready ? 1 : undefined,
      }"
    >
      thumb_up
    </span>
    <Suspense>
      <CardsMenu />
    </Suspense>
  </template>
  <template v-else-if="mode == 'play'">
    <div
      class="top"
      :style="{
        width: `${bingoStore.cellSize * bingoStore.cols}px`,
      }"
    >
      <div class="bingo">
        <div
          @click="toggleMark(index)"
          class="bingo-cell"
          v-for="(cell, index) of bingoStore.selected"
          :key="index"
          :id="`cell_${index}`"
          :style="{
            borderWidth: getBorderWidths(
              Math.floor(index / bingoStore.cols) + 1,
              (index % bingoStore.cols) + 1,
              2
            ),
            height: bingoStore.cellSize + 'px',
            width: bingoStore.cellSize + 'px',
          }"
        >
          <img
            src="/assets/images/bingo_circle.png"
            :style="{
              opacity: bingoStore.marked[index] ? 0.6 : 0,
            }"
          />
          <div
            class="card"
            :style="{
              backgroundImage: `url(${cell[0].image})`,
            }"
          >
            <span
              class="text"
              :style="{
                'font-size': bingoStore.cellSize / 10 + 'px',
              }"
              >{{
                Array.isArray(cell[0].en) ? cell[0].en[0] : cell[0].en
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <span
      @click="setupBingo"
      class="button button-bottom button-left-1 restart-button material-symbols-outlined"
    >
      arrow_back
    </span>
  </template>
  <template v-else-if="mode == 'teach'">Let's teach!</template>
</template>

<style>
@import url("@/assets/style.css");

.sortable-ghost {
  opacity: 0.75;
}

.sortable-ghost .text {
  display: none;
}

.bingo {
  align-items: center;
  align-content: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.bingo-cell {
  border-color: #000;
  border-style: solid;
  overflow: hidden;
  position: relative;
}

.bingo-cell .card {
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-family: "Schoolbell", cursive;
  font-size: min(4vh, 4vw);
  height: 100%;
  justify-content: flex-end;
  text-shadow: rgb(255, 255, 255) 3px 0px 0px,
    rgb(255, 255, 255) 2.83487px 0.981584px 0px,
    rgb(255, 255, 255) 2.35766px 1.85511px 0px,
    rgb(255, 255, 255) 1.62091px 2.52441px 0px,
    rgb(255, 255, 255) 0.705713px 2.91581px 0px,
    rgb(255, 255, 255) -0.287171px 2.98622px 0px,
    rgb(255, 255, 255) -1.24844px 2.72789px 0px,
    rgb(255, 255, 255) -2.07227px 2.16926px 0px,
    rgb(255, 255, 255) -2.66798px 1.37182px 0px,
    rgb(255, 255, 255) -2.96998px 0.42336px 0px,
    rgb(255, 255, 255) -2.94502px -0.571704px 0px,
    rgb(255, 255, 255) -2.59586px -1.50383px 0px,
    rgb(255, 255, 255) -1.96093px -2.27041px 0px,
    rgb(255, 255, 255) -1.11013px -2.78704px 0px,
    rgb(255, 255, 255) -0.137119px -2.99686px 0px,
    rgb(255, 255, 255) 0.850987px -2.87677px 0px,
    rgb(255, 255, 255) 1.74541px -2.43999px 0px,
    rgb(255, 255, 255) 2.44769px -1.73459px 0px,
    rgb(255, 255, 255) 2.88051px -0.838247px 0px;
  transition: font-size 2s;
  width: 100%;
}

.bingo-cell img {
  height: 100%;
  left: 0;
  opacity: 0.6;
  position: absolute;
  top: 0;
  transition: 0.5s;
  width: 100%;
}

.bingo-cell .handle {
  display: none;
}

.top {
  margin: auto;
}
</style>
