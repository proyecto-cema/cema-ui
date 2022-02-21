import ListEstablishments from "../views/administration/ListEstablishments";
import ListSubscriptions from '../views/administration/ListSubscriptions';

const routes = [
  {
    path: '/establecimientos',
    name: 'ListEstablishments',
    meta: { requiresAuth: true, requiredRoleLevel: 2 },
    component: ListEstablishments
  },
  {
    path: '/suscripciones',
    name: 'ListSubscriptions',
    meta: { requiresAuth: true, requiredRoleLevel: 0 },
    component: ListSubscriptions,
    params: { modal: false }
  }
]

export default routes
