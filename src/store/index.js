import { createStore } from 'vuex'
import auth from './modules/auth.module'
import mutations from './mutations'
import actions from './actions'
import bovine from './modules/bovine.module'
import establishment from './modules/establishment.module'
import activity from './modules/activity.module'
import vaccine from './modules/vaccination.module'

export default createStore({
  state: {
    sidenav: true,
    establishmentName: "Nombre Establecimiento",
    dataToasts: [],
    idToastHelper: {}
  },
  mutations: mutations,
  actions: actions,
  modules: {
    auth,
    bovine,
    establishment,
    vaccine,
    activity
  },
  getters:{
    isMobile(){
      return screen.width <= 760
    }
  }
})
