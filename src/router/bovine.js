import ListBovine from '../views/bovine/ListBovine.vue'

const routes = [
  {
    path: '/bovinos/listado',
    name: 'ListBovine',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: ListBovine
  }
]

export default routes
