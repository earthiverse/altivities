import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import VueFinalModal from "vue-final-modal";

createApp(App).use(createPinia()).use(VueFinalModal).use(router).mount("#app");
