import ListBovine from '../views/bovine/ListBovine.vue'

const routes = [
  {
    path: '/bovinos/listado',
    name: 'ListBovine',
    meta: { requiresAuth: true },
    component: ListBovine
  }
]

export default routes
