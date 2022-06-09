import { createApp } from "vue";
import { createPinia } from "pinia";
import VueQRCode from "@chenfengyuan/vue-qrcode";
import VueFinalModal from "vue-final-modal";
import App from "./BingoApp.vue";

const app = createApp(App);

app.component(VueQRCode.name, VueQRCode);

app.use(createPinia());
app.use(VueFinalModal);

app.mount("#app");
