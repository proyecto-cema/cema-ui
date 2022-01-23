import { createStore } from 'vuex'
import auth from './modules/auth.module'
import mutations from './mutations'
import actions from './actions'
import bovine from './modules/bovine.module'
import establishment from './modules/establishment.module'
import user from './modules/user.module'
import activity from './modules/activity.module'
import reporting from './modules/reporting.module'
import location from './modules/location.module'
import operation from './modules/operation.module'
import audit from './modules/audit.module'
import supply from './modules/supply.module'

export default createStore({
  state: {
    sidenav: true,
    establishmentName: "Nombre Establecimiento",
    dataToasts: [],
    notificationsToasts: [],
    idToastHelper: {}
  },
  mutations: mutations,
  actions: actions,
  modules: {
    auth,
    bovine,
    establishment,
    user,
    activity,
    reporting,
    location,
    operation,
    audit,
    supply
  },
  getters:{
    isMobile(){
      return screen.width <= 760
    }
  }
})
