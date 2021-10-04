import VaccinationModal from '../components/activity/VaccinationModal.vue'


const routes = [
  {
    path: '/vacunacion',
    name: 'VaccinationModal',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: VaccinationModal
  }
]

export default routes
