import Login from '../views/auth/Login.vue'

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