import AddBovine from '../views/Bovine/AddBovine.vue'

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
        meta: { requiresAuth: true },
        component: AddBovine
    }
]

export default routes