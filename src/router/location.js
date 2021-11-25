import ListLocations from "../views/administration/ListLocations";

const routes = [
  {
    path: '/ubicaciones',
    name: 'ListLocations',
    meta: { requiresAuth: true, requiredRoleLevel: 1 },
    component: ListLocations
  }
]

export default routes
