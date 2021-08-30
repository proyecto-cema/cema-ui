import AddEstablishment from '../views/Administration/AddEstablishment.vue'

const routes = [
  {
    path: '/establecimiento/formulario',
    name: 'AddEstablishment',
    meta: { requiresAuth: false },
    component: AddEstablishment
  }
]

export default routes
