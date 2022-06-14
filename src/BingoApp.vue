<script setup lang="ts">
import draggable from "vuedraggable";
import CardsMenu from "@/components/CardsMenu.vue";
import BingoSettingsToggle from "./components/BingoSettingsToggle.vue";
import QRToggle from "@/components/QRToggle.vue";
import { useBingoStore } from "@/stores/bingo";
import { useWordListStore } from "@/stores/wordlist";
import { onMounted, watch } from "vue";
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
  bingoStore.checkReady();
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
  wordlistStore.resetStore();
  bingoStore.resetStore();
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

  bingoStore.checkReady();
}

function playBingo() {
  bingoStore.resetMarked();
  if (bingoStore.checkReady()) bingoStore.mode = "play";
}

function toggleMark(index: number) {
  bingoStore.marked[index] = !bingoStore.marked[index];
}

function setupBingo(reset = false) {
  bingoStore.mode = "set";
  if (reset) resetBingo();
}

function teachBingo() {
  wordlistStore.resetStore();
  bingoStore.resetStore();
  bingoStore.mode = "teach";
}

function drawRandom() {
  if (wordlistStore.unselected[0].length == 0) throw "No more words to draw";

  // Select a new word
  const randomIndex = randomIntFromInterval(
    0,
    wordlistStore.unselected[0].length - 1
  );
  const word = wordlistStore.unselected[0].splice(randomIndex, 1)[0];
  wordlistStore.selected[0].push(word);
}

function undoDraw() {
  const word = wordlistStore.selected[0].pop();
  if (!word) return;
  wordlistStore.unselected[0].push(word);
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

  bingoStore.checkReady();
};

onMounted(() => {
  window.addEventListener("resize", () => {
    bingoStore.calculateCellSize();
  });
});
</script>

<template>
  <template v-if="bingoStore.mode == 'set'">
    <QRToggle />
    <BingoSettingsToggle />
    <span
      @click="teachBingo"
      class="material-symbols-outlined button button-top button-left-3 teach-button"
    >
      school
    </span>

    <div class="top">
      <div
        class="bingo"
        :style="{
          width: `${bingoStore.cellSize * bingoStore.cols}px`,
        }"
      >
        <template v-for="row in bingoStore.rows">
          <draggable
            @add="onAdd"
            @remove="bingoStore.checkReady"
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
        color: bingoStore.ready ? 'green' : 'black',
        cursor: bingoStore.ready ? 'pointer' : 'not-allowed',
        opacity: bingoStore.ready ? 1 : undefined,
      }"
    >
      thumb_up
    </span>
    <Suspense>
      <CardsMenu />
    </Suspense>
  </template>
  <template v-else-if="bingoStore.mode == 'play'">
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
      @click="setupBingo(false)"
      class="button button-bottom button-left-1 restart-button material-symbols-outlined"
    >
      arrow_back
    </span>
  </template>
  <template v-else-if="bingoStore.mode == 'teach'">
    <QRToggle />
    <BingoSettingsToggle />

    <div animation="200" class="large-card">
      <div
        :style="{
          backgroundImage: `url(${
            wordlistStore.selected[0][wordlistStore.selected[0].length - 1]
              .image
          })`,
        }"
        v-if="wordlistStore.selected[0].length"
      >
        <span class="material-symbols-outlined handle">drag_handle</span>
        <span class="text">{{
          Array.isArray(
            wordlistStore.selected[0][wordlistStore.selected[0].length - 1].en
          )
            ? wordlistStore.selected[0][wordlistStore.selected[0].length - 1]
                .en[0]
            : wordlistStore.selected[0][wordlistStore.selected[0].length - 1].en
        }}</span>
      </div>
    </div>
    <span
      @click="setupBingo(true)"
      class="button button-bottom button-left-1 back-button material-symbols-outlined"
    >
      arrow_back
    </span>
    <span
      @click="resetBingo"
      class="button button-bottom button-left-2 restart-button material-symbols-outlined"
    >
      restart_alt
    </span>
    <span
      @click="undoDraw"
      class="button button-bottom button-right-2 undo-button material-symbols-outlined"
    >
      undo
    </span>
    <span
      @click="drawRandom"
      class="button button-bottom button-right-1 random-button material-symbols-outlined"
    >
      casino
    </span>
    <Suspense>
      <CardsMenu />
    </Suspense>
  </template>
</template>

<style>
@import url("@/assets/style.css");

.sortable-ghost {
  opacity: 0.75;
}

.sortable-ghost .text {
  display: none;
}

.top {
  align-items: center;
  justify-content: center;
}

.bingo {
  align-content: center;
  display: flex;
  flex-wrap: wrap;
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

.teach-button {
  color: orange;
}
.large-card {
  aspect-ratio: 1 / 1;
  border: 2pt dashed #000;
  border-radius: 44pt;
  height: min(100%, 100vw);
  margin: auto;
  overflow: hidden;
}

.large-card div {
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-family: "Schoolbell", cursive;
  font-size: min(8vh, 8vw);
  height: 100%;
  justify-content: flex-end;
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

.large-card div .handle {
  display: none;
}

.large-card div .text {
  margin-bottom: 4pt;
}
</style>
