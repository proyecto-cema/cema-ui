import ListLocations from "../views/administration/ListLocations";

const routes = [
  {
    path: '/ubicaciones',
    name: 'ListLocations',
    meta: { requiresAuth: true, requiredRoleLevel: 2 },
    component: ListLocations
  }
]

export default routes
