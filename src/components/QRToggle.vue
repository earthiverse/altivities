<script setup lang="ts">
import { onMounted, ref } from "vue";
let show = ref(false);

function getURL() {
  return window.location.href;
}
function calculateQRSize() {
  return Math.min(window.innerWidth, window.innerHeight) * 0.75;
}
const qrWidth = ref(calculateQRSize());
onMounted(() => {
  window.addEventListener("resize", () => {
    qrWidth.value = calculateQRSize();
  });
});
</script>

<script lang="ts"></script>

<template>
  <VueFinalModal
    v-model="show"
    classes="modal-container"
    content-class="modal-content"
  >
    <vue-qrcode
      :value="getURL()"
      :lock-scroll="true"
      :click-to-close="true"
      :esc-to-close="true"
      tag="svg"
      :options="{ errorCorrectionLevel: 'L', width: qrWidth, margin: 1 }"
    ></vue-qrcode>
  </VueFinalModal>
  <span
    class="material-symbols-outlined top-button qr-code-button"
    @click="show = true"
    >qr_code</span
  >
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.qr-code-button {
  border-color: red;
  color: red;
}

.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  display: inline-block;
  padding: 1rem;
  border: 4pt solid red;
  border-radius: 44pt;
  background: #fff;
}
</style>
