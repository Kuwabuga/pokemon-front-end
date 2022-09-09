import { RouteRecordRaw, createRouter, createWebHistory, RouterOptions } from "vue-router";

export const routesNames = {
	HelloWorld: "hello-world",
	TermsAndConditions: "terms-and-conditions",
	About: "about",
	NotFound: "not-found"
};

const routes: Array<RouteRecordRaw> = [
  <RouteRecordRaw>{
  	path: "/",
  	name: routesNames.HelloWorld,
  	component: () => import("@/views/HelloWorld.vue")
  },
  <RouteRecordRaw>{
  	path: "/terms-and-conditions",
  	name: routesNames.TermsAndConditions,
  	component: () => import("@/views/TermsAndConditions.vue")
  },
  <RouteRecordRaw>{
  	path: "/about",
  	name: routesNames.About,
  	component: () => import("@/views/About.vue")
  },
  <RouteRecordRaw>{
  	path: "/:catchAll(.*)*",
  	name: routesNames.NotFound,
  	component: () => import("@/views/NotFound.vue")
  }
];

const router = createRouter(<RouterOptions>{
	history: createWebHistory(""),
	routes: routes
});

export default router;
