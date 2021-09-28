import ListBovine from '../views/bovine/ListBovine.vue'
import ListBatch from '../views/bovine/ListBatch.vue'

const routes = [
  {
    path: '/bovinos/listado',
    name: 'ListBovine',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: ListBovine
  },
  {
    path: '/bovinos/listadoLotes',
    name: 'ListBatch',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: ListBatch
  }
]

export default routes
