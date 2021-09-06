import AddBovine from '../views/bovine/AddBovine.vue'
import ListBovine from '../views/bovine/ListBovine.vue'

const routes = [
  {
    path: '/bovinos/formulario',
    name: 'AddBovine',
    meta: { requiresAuth: true },
    component: AddBovine
  },
  {
    path: '/bovinos/listado',
    name: 'ListBovine',
    meta: { requiresAuth: true },
    component: ListBovine
  }
]

export default routes
