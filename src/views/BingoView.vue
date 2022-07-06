<template>
  <QRButton class="top-button-1 left-button-1"></QRButton>
  <template v-if="mode == 'set'">
    <IconButton class="top-button-1 left-button-2" @click="teach">
      school
    </IconButton>
    <IconButton :class="['bottom-button-1', 'left-button-1']" @click="reset">
      restart_alt
    </IconButton>
    <IconButton :class="['bottom-button-1', 'left-button-2']" @click="shuffle">
      shuffle
    </IconButton>
    <IconButton
      class="bottom-button-1 right-button-1"
      @click="play"
      :style="{
        cursor: ready ? 'pointer' : 'not-allowed',
        opacity: ready ? 1 : 0.3,
      }"
    >
      thumb_up
    </IconButton>
    <TopArea>
      <div v-for="col in cols" :key="col">
        <div v-for="row in rows" :key="row">
          <CardSlot
            animation="200"
            easing="cubic-bezier(0.33, 1, 0.68, 1)"
            class="bingo-cell"
            :handle="true"
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
        v-model="unselected"
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
          <BingoCardSlot
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
          ></BingoCardSlot>
        </div>
      </div>
    </TopArea>
  </template>
  <template v-else-if="mode == 'teach'">
    <IconButton
      :class="['bottom-button-1', 'left-button-1']"
      @click="stopTeach"
    >
      arrow_back
    </IconButton>
    <IconButton :class="['bottom-button-1', 'left-button-2']" @click="reset">
      restart_alt
    </IconButton>
    <IconButton
      :class="['bottom-button-1', 'right-button-2']"
      @click="undraw"
      :style="{
        cursor: drawn.length ? 'pointer' : 'not-allowed',
        opacity: drawn.length ? 1 : 0.3,
      }"
    >
      undo
    </IconButton>
    <IconButton
      :class="['bottom-button-1', 'right-button-1']"
      @click="draw"
      :style="{
        cursor: unselected.length ? 'pointer' : 'not-allowed',
        opacity: unselected.length ? 1 : 0.3,
      }"
    >
      casino
    </IconButton>
    <TopArea>
      <CardSlot :handle="false" name="drawn"></CardSlot>
    </TopArea>
    <BottomArea>
      <Draggable
        animation="200"
        v-model="unselected"
        easing="cubic-bezier(0.33, 1, 0.68, 1)"
        handle=".handle"
        group="cards"
        id="unselected"
        item-key="id"
      >
        <template #item="{ element }">
          <StaticCard
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
import BingoCardSlot from "@/components/BingoCardSlot.vue";
import DraggableCard from "@/components/DraggableCard.vue";
import { randomIntFromInterval } from "@/random";
import StaticCard from "@/components/StaticCard.vue";

const url = new URL(window.document.URL);
const urlRows = Number.parseInt(url.searchParams.get("rows") ?? "3");
const urlCols = Number.parseInt(url.searchParams.get("cols") ?? "3");

const rows = ref(urlRows);
const cols = ref(urlCols);
const cellSize = ref(100);
const ready = ref(false);
const marked: boolean[] = [];
const mode: Ref<"set" | "play" | "teach"> = ref("set");

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

  checkReady();
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

  checkReady();
}

function teach() {
  reset();

  mode.value = "teach";
}

function stopTeach() {
  wordListStore.reset();
  mode.value = "set";

  checkReady();
}

function draw() {
  // Get card from unselected
  const unselected = wordListStore.getSlotByName("unselected").list;
  if (unselected.length == 0) return; // No cards to draw

  // Move card to drawn
  const random = randomIntFromInterval(0, unselected.length - 1);
  const word = unselected.splice(random, 1)[0];
  const cell = wordListStore.getSlotByName("drawn").list;
  cell.unshift(word);
}

function undraw() {
  // Get card from drawn
  const drawn = wordListStore.getSlotByName("drawn").list;
  if (drawn.length == 0) return; // We haven't drawn any cards

  const word = drawn.splice(0, 1)[0];
  const unselected = wordListStore.getSlotByName("unselected").list;
  unselected.push(word);
}

function play() {
  if (!ready.value) return; // Not ready
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
    BingoCardSlot,
    IconButton,
    StaticCard,
  },
  methods: {
    checkReady: checkReady,
    draw: draw,
    getBorderWidths: getBorderWidths,
    play: play,
    reset: reset,
    shuffle: shuffle,
    stopTeach: stopTeach,
    teach: teach,
    undraw: undraw,
  },
  data() {
    return {
      mode: mode,
      cellSize: cellSize,
      drawn: wordListStore.getSlotByName("drawn").list,
      marked: marked,
      ready: ready,
      rows: rows,
      cols: cols,
      store: wordListStore,
      unselected: wordListStore.getSlotByName("unselected").list,
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

img {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: 0.5s;
  width: 100%;
}

#drawn .card {
  font-family: "Lexend", sans-serif;
  height: 100%;
  text-shadow: #fff 6px 0px 0px, #fff 5.91686px 0.995377px 0px,
    #fff 5.66974px 1.96317px 0px, #fff 5.2655px 2.87655px 0px,
    #fff 4.71532px 3.71022px 0px, #fff 4.03447px 4.44106px 0px,
    #fff 3.24181px 5.04883px 0px, #fff 2.35931px 5.51667px 0px,
    #fff 1.41143px 5.83163px 0px, #fff 0.424423px 5.98497px 0px,
    #fff -0.574341px 5.97245px 0px, #fff -1.55719px 5.79441px 0px,
    #fff -2.49688px 5.45579px 0px, #fff -3.36738px 4.96596px 0px,
    #fff -4.14455px 4.33852px 0px, #fff -4.80686px 3.59083px 0px,
    #fff -5.33596px 2.74364px 0px, #fff -5.71718px 1.8204px 0px,
    #fff -5.93995px 0.84672px 0px, #fff -5.99811px -0.150428px 0px,
    #fff -5.89004px -1.14341px 0px, #fff -5.61874px -2.1047px 0px,
    #fff -5.19172px -3.00766px 0px, #fff -4.62082px -3.82727px 0px,
    #fff -3.92186px -4.54082px 0px, #fff -3.11421px -5.12852px 0px,
    #fff -2.22026px -5.57409px 0px, #fff -1.26477px -5.86518px 0px,
    #fff -0.274238px -5.99373px 0px, #fff 0.723898px -5.95617px 0px,
    #fff 1.70197px -5.75355px 0px, #fff 2.63288px -5.39147px 0px,
    #fff 3.49082px -4.87998px 0px, #fff 4.25202px -4.23324px 0px,
    #fff 4.89538px -3.46919px 0px, #fff 5.40307px -2.60899px 0px,
    #fff 5.76102px -1.67649px 0px, #fff 5.95932px -0.697531px 0px;
  width: 100%;
}

#drawn .card {
  font-size: min(10vw, 10vh);
}

#drawn {
  aspect-ratio: 1 / 1;
  background-color: #fff;
  border: 2px dashed #000;
  border-radius: 10px;
  height: min(100%, 100vw);
}
</style>
