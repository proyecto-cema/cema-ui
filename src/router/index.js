import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import About from '../views/About.vue'
import bovine from './bovine'
import establishment from './establishment'
import login from './login'
import {ROLE_REPRESENTATION} from "../constants";

let routes = []
const localRoutes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true, requiredRoleLevel: null },
    redirect: { name: 'ListBovine' }
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: true, requiredRoleLevel: null },
    component: About
  }
]
routes = routes.concat(localRoutes, bovine, login, establishment)

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { requiresAuth, requiredRoleLevel } = to.meta;
  const isAuth = store.state.auth.user
  if (requiresAuth && !isAuth) {
    next({
      path: '/login',
      query: { redirect: to.path }
    })
  } else if(!requiresAuth || requiredRoleLevel === null || requiredRoleLevel <= ROLE_REPRESENTATION[isAuth.user.role.toUpperCase()]){
    next()
  }
})

export default router
