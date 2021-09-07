import Login from '../views/auth/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      requiresAuth: false,
      plainLayout: true,
      requiredRoleLevel: null
    },
    component: Login
  }
]

export default routes
