import Calendar from '../views/activity/Calendar.vue'
import CalendarPop from '../views/activity/CalendarPopover.vue'


const routes = [
  {
    path: '/calendario',
    name: 'Calendar',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: Calendar
  },
  {
    path: '/calendarioPop',
    name: 'CalendarPop',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: CalendarPop
  }
]

export default routes
