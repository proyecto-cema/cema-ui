import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'
import AddBovine from '../views/Bovine/AddBovine.vue'

const routes = [
  {
    path: '/',
    name: 'AddBovine',
    meta: { requiresAuth: true },
    component: AddBovine
  },
  {
    path: '/home',
    name: 'Home',
    meta: { requiresAuth: true },
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: true },
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log("isauthenticated", store.getters.isAuthenticated);
  if (requiresAuth && !store.getters.isAuthenticated) {
      next("/login");
  } else {
      next();
  }
});

export default router
