import ListSupplies from "../views/operation/ListSupplies";

const routes = [
  {
    path: '/insumos',
    name: 'ListSupplies',
    meta: { requiresAuth: true, requiredRoleLevel: 1 },
    component: ListSupplies
  }
]

export default routes
