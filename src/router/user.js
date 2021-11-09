import ListUser from '../views/user/ListUsers.vue'

const routes = [
  {
    path: '/usuarios',
    name: 'ListUser',
    meta: { requiresAuth: true, requiredRoleLevel: 2 },
    component: ListUser
  }
]

export default routes
