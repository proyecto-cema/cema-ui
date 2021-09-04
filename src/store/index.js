import { createStore } from 'vuex'
import auth from './modules/auth.module'
import mutations from './mutations'
import actions from './actions'
import bovine from './modules/bovine.module'
import establishment from './modules/establishment.module'

export default createStore({
  state: {sidenav: true},
  mutations: mutations,
  actions: actions,
  modules: {
    auth,
    bovine,
    establishment
  },
  getters:{
    isMobile(){
      return screen.width <= 760
    }
  }
})
