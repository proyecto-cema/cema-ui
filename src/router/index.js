import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import About from '../views/About.vue'
import bovine from './bovine'
import establishment from './establishment'
import login from './login'

let routes = []
const localRoutes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true },
    redirect: { name: 'ListBovine' }
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: true },
    component: About
  }
]
routes = routes.concat(localRoutes, bovine, login, establishment)

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuth = store.state.auth.user
  if (requiresAuth && !isAuth) {
    next('/login')
  } else {
    next()
  }
})

export default router
