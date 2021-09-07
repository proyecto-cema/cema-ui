import AddEstablishment from '../views/administration/AddEstablishment.vue'

const routes = [
  {
    path: '/establecimiento/formulario',
    name: 'AddEstablishment',
    meta: { requiresAuth: true },
    component: AddEstablishment
  }
]

export default routes
