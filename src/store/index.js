import { createStore } from 'vuex'
import router from '../router'
import {BASE_URL, LOGIN_PORT} from '../constants'

export default createStore({
  state: {
    user: '',
    error: {tipo: null, mensaje: null}
  },
  mutations: {
    setUser(state, payload){
      state.user = payload
    },
    setError(state, payload){
      if(payload === null) {
        return state.error = {tipo: null, mensaje: null}
      }
      if(payload === "Unauthorized"){
        return state.error = {tipo: 'password', mensaje: 'Contraseña incorrecta'}
      }
      if(payload === "Not Found"){
        return state.error = {tipo: 'UserPass', mensaje: 'Usuario o Contraseña incorrectos'}
      }
      if(payload === "Server"){
        return state.error = {tipo: 'Server', mensaje: 'ERROR en el servidor, intente nuevamente mas tarde.'}
      }
      return state.error = {tipo: 'Undefained', mensaje: 'ERROR indefinido, intente nuevamente mas tarde.'}
    }
  },
  actions: {
    cerrarSesion({commit}){
      commit('setUser', null)
      localStorage.removeItem('usuario')
      router.push('/ingreso')
    },
    async logUserIn({commit}, userData){
      try {
        const res = await fetch("http://"+BASE_URL+":"+LOGIN_PORT+"/v1/users/login/"+userData.user+"?password="+userData.password);
        const userDB = await res.json();
        console.log('Usuario:', userDB);
        console.log(res)
        if(res.status === 404 || res.status === 401){
          console.log(res.statusText);
          return commit('setError', res.statusText);
        }
        commit('setUser', userDB.user);
        commit('setError', null);
        localStorage.setItem('usuario', JSON.stringify(userDB));
        router.push('/');
      } catch (error) {
        commit('setError','Server')
        console.error(error);
      }
    },
    async cargarLocalStorage({commit, state}) {
      if(localStorage.getItem('usuario')){
        commit('setUser', JSON.parse(localStorage.getItem('usuario')))
      }else{
        return commit('setUser', null)
      }
    }
  },
  getters: {
    isAuthenticated(state){
      return !!state.user
    }
  },
  modules: {
  }
})
