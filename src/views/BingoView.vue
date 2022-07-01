<template>
  <template v-if="mode == 'set'">
    <QRButton :class="['top-button-1', 'left-button-1']"></QRButton>
    <IconButton :class="['bottom-button-1', 'left-button-1']" @click="reset">
      restart_alt
    </IconButton>
    <IconButton :class="['bottom-button-1', 'left-button-2']" @click="shuffle">
      shuffle
    </IconButton>
    <IconButton class="bottom-button-1 right-button-1" @click="play">
      thumb_up
    </IconButton>
    <TopArea>
      <div v-for="col in cols" :key="col">
        <div v-for="row in rows" :key="row">
          <CardSlot
            animation="200"
            easing="cubic-bezier(0.33, 1, 0.68, 1)"
            class="bingo-cell"
            :name="`bingo_${(row - 1) * rows + (col - 1)}`"
            :style="{
              borderWidth: getBorderWidths(row, col, 2),
              height: cellSize + 'px',
              width: cellSize + 'px',
            }"
            @add="checkReady"
          ></CardSlot>
        </div>
      </div>
    </TopArea>
    <BottomArea>
      <Draggable
        animation="200"
        v-model="unselected.list"
        easing="cubic-bezier(0.33, 1, 0.68, 1)"
        handle=".handle"
        group="cards"
        id="unselected"
        item-key="id"
      >
        <template #item="{ element }">
          <DraggableCard
            :style="{
              backgroundImage:
                element.image == undefined ? '' : `url(${element.image})`,
            }"
            :text="Array.isArray(element.en) ? element.en[0] : element.en"
          />
        </template>
      </Draggable>
    </BottomArea>
  </template>
  <template v-else-if="mode == 'play'">
    <IconButton
      :class="['bottom-button-1', 'left-button-1']"
      @click="mode = 'set'"
    >
      arrow_back
    </IconButton>

    <TopArea>
      <div v-for="col in cols" :key="col">
        <div v-for="row in rows" :key="row">
          <CardSlot
            animation="200"
            easing="cubic-bezier(0.33, 1, 0.68, 1)"
            class="bingo-cell"
            :name="`bingo_${(row - 1) * rows + (col - 1)}`"
            :style="{
              borderWidth: getBorderWidths(row, col, 2),
              height: cellSize + 'px',
              width: cellSize + 'px',
            }"
            @add="checkReady"
          ></CardSlot>
        </div>
      </div>
    </TopArea>
  </template>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import { useWordListStore } from "@/store/wordlist";
import Draggable from "vuedraggable";
import BottomArea from "@/components/BottomArea.vue";
import IconButton from "@/components/IconButton.vue";
import TopArea from "@/components/TopArea.vue";
import QRButton from "@/components/QRButton.vue";
import CardSlot from "@/components/CardSlot.vue";
import DraggableCard from "@/components/DraggableCard.vue";
import { randomIntFromInterval } from "@/random";

const url = new URL(window.document.URL);
const urlRows = Number.parseInt(url.searchParams.get("rows") ?? "3");
const urlCols = Number.parseInt(url.searchParams.get("cols") ?? "3");

const rows = ref(urlRows);
const cols = ref(urlCols);
const cellSize = ref(100);
const ready = ref(false);
const mode: Ref<"set" | "play"> = ref("set");

const wordListStore = useWordListStore();
wordListStore.addWordListsFromURL().catch((e) => console.error(e));

function calculateCellSize(): number {
  const width = window.innerWidth - 16;
  const height = window.innerHeight - 160;

  cellSize.value = Math.min(width / cols.value, height / rows.value);

  return cellSize.value;
}
calculateCellSize();

function getBorderWidths(row: number, col: number, size = 2) {
  const borderWidths = [size, size, size, size];
  if (row == 1 && rows.value !== 1) {
    // First row -> make the top border larger
    borderWidths[0] *= 2;
  } else if (row == rows.value && rows.value !== 1) {
    // Last row -> make the bottom border larger
    borderWidths[2] *= 2;
  }
  if (col == 1 && cols.value !== 1) {
    // First col -> make the left border larger
    borderWidths[3] *= 2;
  } else if (col == cols.value && cols.value !== 1) {
    // Last col -> make the right border larger
    borderWidths[1] *= 2;
  }
  return borderWidths.join("px ") + "px";
}

// Logic to swap the current card (if one exists)
function checkReady() {
  for (let i = 0; i < cols.value * rows.value; i++) {
    const id = wordListStore.getSlotByName(`bingo_${i}`).list[0];
    if (id === undefined) {
      ready.value = false;
      return false;
    }
  }
  ready.value = true;
  return true;
}

function reset() {
  wordListStore.reset();
}

function shuffle() {
  wordListStore.reset();

  const numCells = rows.value * cols.value;
  const unselected = wordListStore.getSlotByName("unselected").list;
  if (unselected.length < numCells) return; // Not enough words to fill cells

  for (let i = 0; i < numCells; i++) {
    const random = randomIntFromInterval(0, unselected.length - 1);
    const word = unselected.splice(random, 1)[0];
    const cell = wordListStore.getSlotByName(`bingo_${i}`).list;
    cell.push(word);
  }
}

function play() {
  mode.value = "play";
}

export default defineComponent({
  name: "HomeView",
  components: {
    BottomArea,
    TopArea,
    QRButton,
    Draggable,
    DraggableCard,
    CardSlot,
    IconButton,
  },
  methods: {
    checkReady: checkReady,
    getBorderWidths: getBorderWidths,
    play: play,
    reset: reset,
    shuffle: shuffle,
  },
  data() {
    return {
      mode: mode,
      cellSize: cellSize,
      rows: rows,
      cols: cols,
      store: wordListStore,
      unselected: wordListStore.getSlotByName("unselected"),
    };
  },
  setup() {
    onMounted(() => {
      window.addEventListener("resize", () => {
        calculateCellSize();
      });
    });
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0");
@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@400&display=swap");
@import url("@/assets/button.css");
@import url("@/assets/card.css");

body,
html,
#app {
  overflow: hidden;
}

.bingo-cell {
  background: #fff;
  border-color: #000;
  box-sizing: border-box;
  border-style: solid;
  overflow: hidden;
  position: relative;
}
</style>
