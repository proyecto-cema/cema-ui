import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap'
import { FontAwesomeIcon } from './plugins/font-awesome'
import utils from "./utils";
import VCalendar from 'v-calendar';


createApp(App)
    .use(store)
    .use(router)
    .mixin(utils)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(VCalendar, {})
    .mount('#app')