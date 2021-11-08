import AddUser from '../views/user/AddUser.vue'

const routes = [
  {
    path: '/usuarios/formulario',
    name: 'AddUser',
    meta: { requiresAuth: true, requiredRoleLevel: 2 },
    component: AddUser
  }
]

export default routes
