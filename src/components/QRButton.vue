<template>
  <div>
    <vue-final-modal
      v-model="show"
      classes="modal-container"
      content-class="modal-content-qr"
      overlay-class="modal-overlay"
      attach="#app"
    >
      <VueQRCode
        :value="window.location.href"
        :lock-scroll="true"
        :click-to-close="true"
        :esc-to-close="true"
        tag="svg"
        :options="{ errorCorrectionLevel: 'L', width: qrWidth, margin: 1 }"
      />
    </vue-final-modal>
    <IconButton @click="show = true">qr_code</IconButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import VueQRCode from "@chenfengyuan/vue-qrcode";
import IconButton from "./IconButton.vue";

function calculateQRSize() {
  return Math.min(window.innerWidth, window.innerHeight) * 0.75;
}
const qrWidth = ref(calculateQRSize());

export default defineComponent({
  components: {
    IconButton,
    VueQRCode,
  },
  name: "QRButton",
  data() {
    const show = ref(false);
    return {
      qrWidth: qrWidth,
      show: show,
      window: window,
    };
  },
  setup() {
    onMounted(() => {
      window.addEventListener("resize", () => {
        qrWidth.value = calculateQRSize();
      });
    });
  },
});
</script>

<style>
@import url("@/assets/modal.css");

.modal-content-qr {
  color: #fff;
  display: inline-block;
  padding: 1rem;
  border: 4pt solid #eee;
  border-radius: 44pt;
  background: #fff;
}
</style>
