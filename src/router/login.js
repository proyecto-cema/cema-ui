import Login from '../views/Login.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        meta: {
            requiresAuth: false,
            plainLayout: true,
        },
        component: Login
    }
]

export default routes