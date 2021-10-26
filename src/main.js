import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap'
import { FontAwesomeIcon } from './plugins/font-awesome'
import utils from "./utils";

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

createApp(App)
    .use(store)
    .use(router)
    .mixin(utils)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
