import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "DashBoard",
    },
    {
      path: "/dashboard",
      name: "DashBoard",
      component: () => import("@/pages/DashBoard.vue"),
    },
    {
      path: "/storage",
      name: "Storage",
      component: () => import("@/pages/Storage.vue"),
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("@/pages/Settings/index.vue"),
    },
  ],
});

export default router;
