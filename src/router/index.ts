import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/bingo",
    name: "bingo",
    component: () =>
      import(/* webpackChunkName: "bingo" */ "../views/BingoView.vue"),
  },
  {
    path: "/cards",
    name: "cards",
    component: () =>
      import(/* webpackChunkName: "cards" */ "../views/CardsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
