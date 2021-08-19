import { createStore } from 'vuex'
import auth from "./modules/auth";
import mutations from "./mutations";
import actions from "./actions";

export default createStore({
  mutations: mutations,
  actions: actions,
  modules: {
    auth
  }
})
