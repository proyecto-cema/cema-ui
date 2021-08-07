import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.getters.isAuthenticated) next({ name: 'Login' })
  else next()
})


export default router
