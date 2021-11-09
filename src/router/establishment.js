import ListEstablishments from "../views/administration/ListEstablishments";

const routes = [
  {
    path: '/establecimientos',
    name: 'ListEstablishments',
    meta: { requiresAuth: true, requiredRoleLevel: 2 },
    component: ListEstablishments
  }
]

export default routes
