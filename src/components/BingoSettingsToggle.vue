<script setup lang="ts">
import { useBingoStore } from "@/stores/bingo";
import { useWordListStore } from "@/stores/wordlist";
import { updateURLParameter } from "@/url";
import { ref } from "vue";
let show = ref(false);

const bingoStore = useBingoStore();
const wordlistStore = useWordListStore();

function updateSettings() {
  // Get the new settings
  const rows = Number.parseInt(
    (document.querySelector('input[name="rows"]') as HTMLInputElement).value
  );
  const cols = Number.parseInt(
    (document.querySelector('input[name="cols"]') as HTMLInputElement).value
  );

  // Update Store
  bingoStore.rows = rows;
  bingoStore.cols = cols;

  // Update URL
  updateURLParameter("rows", rows.toString());
  updateURLParameter("cols", cols.toString());

  bingoStore.mode = "set";
  wordlistStore.resetStore();
  bingoStore.resetStore();

  // Hide the modal
  show.value = false;
}
</script>

<template>
  <vue-final-modal
    v-model="show"
    classes="modal-container"
    content-class="modal-content"
  >
    <form
      class="how-many-settings-form"
      @submit.prevent="updateSettings"
      name="type"
    >
      # Rows
      <input type="number" id="rows" name="rows" :value="bingoStore.rows" />

      # Columns
      <input type="number" id="cols" name="cols" :value="bingoStore.cols" />
      <input type="submit" value="Set" />
    </form>
  </vue-final-modal>
  <span
    class="material-symbols-outlined button button-top button-left-2 settings-button"
    @click="show = true"
    >settings</span
  >
</template>

<style>
.how-many-settings-form input {
  margin-bottom: 10pt;
}

.settings-button {
  border-color: blue;
  color: blue;
}

.modal-content {
  background: #fff;
  border: 4pt solid blue;
  border-radius: 44pt;
  display: inline-block;
  padding: 32pt;
}

.modal-content label,
.modal-content input {
  font-family: Arial, Helvetica, sans-serif;
  font-size: min(4vh, 4vw);
  font-weight: bold;
  line-height: 1.1;
  display: grid;
  grid-template-columns: 1em auto;
  gap: 0.5em;
}

.form {
  margin-left: 44pt;
}

form,
form input {
  font-size: 44pt;
}

form input[type="number"] {
  margin-right: 11pt;
  text-align: center;
  width: 88pt;
  -moz-appearance: textfield;
}
</style>
