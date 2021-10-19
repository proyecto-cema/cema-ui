import VaccinationModal from '../components/activity/VaccinationModal.vue'
import Calendar from '../views/activity/Calendar.vue'
import CalendarPop from '../views/activity/CalendarPopover.vue'


const routes = [
  {
    path: '/vacunacion',
    name: 'VaccinationModal',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: VaccinationModal
  },
  {
    path: '/calendario',
    name: 'Calendar',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: Calendar
  }
]

export default routes
