import { createApp } from "vue";

import App from "./App.vue";
import "./style.css";
import "vue-sonner/style.css";

import { VueQueryPlugin } from "@tanstack/vue-query";

import routes from "./routes";

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(routes);
app.mount("#app");
