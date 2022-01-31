import ListSupplies from "../views/administration/ListSupplies";

const routes = [
  {
    path: '/ubicaciones',
    name: 'ListSupplies',
    meta: { requiresAuth: true, requiredRoleLevel: 1 },
    component: ListSupplies
  }
]

export default routes
