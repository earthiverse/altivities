<template>
  <div>
    <vue-final-modal
      v-model="show"
      classes="modal-container"
      content-class="modal-content-qr"
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
    <div :class="['material-symbols-outlined', 'button']" @click="show = true">
      qr_code
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import VueQRCode from "@chenfengyuan/vue-qrcode";

function calculateQRSize() {
  return Math.min(window.innerWidth, window.innerHeight) * 0.75;
}
const qrWidth = ref(calculateQRSize());

onMounted(() => {
  window.addEventListener("resize", () => {
    qrWidth.value = calculateQRSize();
  });
});

export default defineComponent({
  components: {
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
});
</script>

<style>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content-qr {
  color: #fff;
  display: inline-block;
  padding: 1rem;
  border: 4pt solid #eee;
  border-radius: 44pt;
  background: #fff;
}
</style>

<style scoped>
.button {
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 44pt;
  height: 44pt;
  user-select: none;
  width: 44pt;
}
</style>
