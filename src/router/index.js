import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Dashboard from '../views/Dashboard.vue'
import bovine from './bovine'
import establishment from './establishment'
import location from './location'
import operation from './operation'
import user from './user'
import login from './login'
import activity from './activity'
import audit from './audit'
import supply from './supply'
import disease from './disease'
import {ROLE_REPRESENTATION} from "../constants";

let routes = []
const localRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    meta: { requiresAuth: true, requiredRoleLevel: 1 },
    component: Dashboard
  },
]
routes = routes.concat(localRoutes, bovine, login, establishment, activity, user, location, operation, audit, supply, disease)

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
