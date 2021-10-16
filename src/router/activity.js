import ActivitySelector from "../views/activities/ActivitySelector";


const routes = [
  {
    path: '/actividades',
    name: 'ActivitySelector',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: ActivitySelector
  }
]

export default routes
