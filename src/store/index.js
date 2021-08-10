import { createStore } from 'vuex'
import router from '../router'
import {BASE_URL, BOVINE_PORT, LOGIN_PORT} from '../constants'

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
      if(payload === "EMAIL_NOT_FOUND"){
        return state.error = {tipo: 'email', mensaje: 'Email no registrado'}
      }
      if(payload === "INVALID_PASSWORD"){
        return state.error = {tipo: 'password', mensaje: 'Contraseña incorrecta'}
      }
      if(payload === "EMAIL_EXISTS"){
        return state.error = {tipo: 'email', mensaje: 'Email ya registrado'}
      }
      if(payload === "INVALID_EMAIL"){
        return state.error = {tipo: 'email', mensaje: 'Formato incorrecto de email'}
      }
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
        const res = await fetch(BASE_URL+":"+LOGIN_PORT+"/v1/users/login/"+userData.email+"?password="+userData.password,
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic Y2VtYTpzbGlwa25vdA==',
          },
        });
        const userDB = await res.json();
        console.log('Usuario:', userDB);
        console.log(res)
        if(res.status === 404 || res.status === 401){
          console.log(res.statusText);
          return commit('setError', res.statusText);
        }
        commit('setUser', userDB.email);
        commit('setError', null);
        localStorage.setItem('usuario', JSON.stringify(userDB))
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    },
    async registerUser({commit}, email, pass, userData){
      try {
        const res = await fetch(BASE_URL+":"+LOGIN_PORT+"/v1/users/login/"+email+"?password=12345",
            {
              method: 'PUT', // *GET, POST, PUT, DELETE, etc.
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic Y2VtYTpzbGlwa25vdA==',
              },
              body: JSON.stringify(userData)
            }
          );
        const helper = await res.json();
        console.log('Bovine:', helper);
        console.log(res)
      } catch (error) {
        console.error(error);
      }
    },
  },
  getters: {
    isAuthenticated(state){
      return !!state.user
    }
  },
  modules: {
  }
})
