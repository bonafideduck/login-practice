import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import LandingPage from "./components/LandingPage.vue";
import CreateUser from "./components/CreateUser.vue";
import OneStepLogin from "./components/OneStepLogin.vue";
import TwoStepLogin from "./components/TwoStepLogin.vue";
import AdminPage from "./components/AdminPage.vue";

const routes = [
  { path: "/", component: LandingPage },
  { path: "/create-user", component: CreateUser },
  { path: "/one-step-login", component: OneStepLogin },
  { path: "/two-step-login", component: TwoStepLogin },
  { path: "/admin", component: AdminPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
