import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./HowManyApp.vue";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
