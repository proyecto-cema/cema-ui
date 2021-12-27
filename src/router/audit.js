import ListAudits from '../views/administration/ListAudits.vue'


const routes = [
  {
    path: '/auditorias',
    name: 'ListAudits',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: ListAudits
  }
]

export default routes
