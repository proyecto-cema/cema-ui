import ListUser from '../views/user/ListUsers.vue'

const routes = [
  {
    path: '/usuarios',
    name: 'ListUser',
    meta: { requiresAuth: true, requiredRoleLevel: 1 },
    component: ListUser
  }
]

export default routes
