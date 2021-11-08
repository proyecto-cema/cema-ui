import Calendar from '../views/activity/Calendar.vue'


const routes = [
  {
    path: '/calendario',
    name: 'Calendar',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: Calendar
  }
]

export default routes
