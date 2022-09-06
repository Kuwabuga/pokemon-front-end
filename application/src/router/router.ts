import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  <RouteRecordRaw>{
    path: "/hello-world",
    name: "hello-world",
    component: () => import("@/views/HelloWorld.vue")
  },
  <RouteRecordRaw>{
    path: "/:catchAll(.*)*"
  }
]

const Router = createRouter({
  history: createWebHistory(""),
  routes: routes
});

export default Router;
