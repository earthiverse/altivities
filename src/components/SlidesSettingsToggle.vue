<script setup lang="ts">
import { useSlidesStore } from "@/stores/slides";
import { useWordListStore } from "@/stores/wordlist";
import { updateURLParameter } from "@/url";
import { ref } from "vue";
let show = ref(false);

const slidesStore = useSlidesStore();
const wordlistStore = useWordListStore();

function updateSettings() {
  // Get the new settings
  const type = (
    document.querySelector('input[name="type"]:checked') as HTMLInputElement
  ).value;

  // Update 'type'
  updateURLParameter("type", type);

  // Remake slides
  slidesStore.removeAllSlides();
  slidesStore.addSlidesFromWordList(wordlistStore.words);

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
    <form @submit.prevent="updateSettings" name="type">
      <label>
        <input type="radio" id="en" name="type" value="img" />
        Picture
      </label>
      <br />
      <label>
        <input type="radio" id="en" name="type" value="img,en" />
        Picture → English
      </label>
      <br />
      <label>
        <input type="radio" id="en" name="type" value="en" />
        English
      </label>
      <br />
      <label>
        <input type="radio" id="enja" name="type" value="en,ja" />
        English → Japanese
      </label>
      <br />
      <label>
        <input type="radio" id="ja" name="type" value="ja" />
        Japanese
      </label>
      <br />
      <input type="submit" value="Set" />
    </form>
  </vue-final-modal>
  <span
    class="material-symbols-outlined top-button settings-button"
    @click="show = true"
    >settings</span
  >
</template>

<style>
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
</style>
