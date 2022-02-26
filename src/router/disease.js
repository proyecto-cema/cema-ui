import ListDiseases from "../views/health/ListDiseases";
import ListIllness from "../views/health/ListIllness";

const routes = [
  {
    path: '/enfermedades',
    name: 'ListDiseases',
    meta: { requiresAuth: false, requiredRoleLevel: 0 },
    component: ListDiseases
  },
  {
    path: '/seguimiento',
    name: 'ListIllness',
    meta: { requiresAuth: false, requiredRoleLevel: 0 },
    component: ListIllness
  }
]

export default routes
