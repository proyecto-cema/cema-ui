import ListDiseases from "../views/health/ListDiseases";

const routes = [
  {
    path: '/enfermedades',
    name: 'ListDiseases',
    meta: { requiresAuth: false, requiredRoleLevel: 0 },
    component: ListDiseases
  }
]

export default routes
