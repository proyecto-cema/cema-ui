import ListUser from '../views/administration/ListUsers.vue'

const routes = [
  {
    path: '/usuarios',
    name: 'ListUser',
    meta: { requiresAuth: true, requiredRoleLevel: 1 },
    component: ListUser
  }
]

export default routes
