import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import bovine from "./bovine";
import login from "./login";

let routes = []
const localRoutes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true },
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: true },
    component: About
  }
]
routes = routes.concat(localRoutes, bovine, login)

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuth = localStorage.getItem('user');
  store.state.auth.user = isAuth;
  console.log("isAuthenticated", isAuth);
  if (requiresAuth && !isAuth) {
      next("/login");
  } else {
      next();
  }
});

export default router
