import AddBovine from '../views/Bovine/AddBovine.vue'
import ListBovine from '../views/Bovine/ListBovine.vue'

const routes = [
    {
        path: '/bovinos/nuevo',
        name: 'AddBovine',
        meta: { requiresAuth: true },
        component: AddBovine
    },
    {
        path: '/bovinos/listado',
        name: 'ListBovine',
        meta: { requiresAuth: false },
        component: ListBovine
    }
]

export default routes