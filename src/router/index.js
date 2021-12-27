import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import About from '../views/About.vue'
import Dashboard from '../views/Dashboard.vue'
import bovine from './bovine'
import establishment from './establishment'
import location from './location'
import user from './user'
import login from './login'
import activity from './activity'
import audit from './audit'
import {ROLE_REPRESENTATION} from "../constants";

let routes = []
const localRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    meta: { requiresAuth: true, requiredRoleLevel: 1 },
    component: Dashboard
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: true, requiredRoleLevel: null },
    component: About
  }
]
routes = routes.concat(localRoutes, bovine, login, establishment, activity, user,location, audit)

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
  } else {
    next({
      path: '/bovinos/listado',
    })
  }
})

export default router
