import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./SlidesApp.vue";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
