import ListOperations from "../views/operation/ListOperations";

const routes = [
  {
    path: '/operaciones',
    name: 'ListOperations',
    meta: { requiresAuth: false, requiredRoleLevel: 0 },
    component: ListOperations
  }
]

export default routes
