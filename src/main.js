import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap'
import { FontAwesomeIcon } from './plugins/font-awesome'
import utils from "./utils";
import VCalendar from 'v-calendar';


import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import wb from "./registerServiceWorker";

Chart.register(...registerables, ChartDataLabels);

const app = createApp(App)
    .use(store)
    .use(router)
    .mixin(utils)
    .provide("workbox", wb)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(VCalendar, {})
    .mount('#app')