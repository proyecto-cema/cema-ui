import { createStore } from 'vuex'
import router from '../router'
import {BASE_URL, BOVINE_PORT} from '../constants'

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
        return state.error = {type: null, message: null}
      }
      if(payload === "EMAIL_NOT_FOUND"){
        return state.error = {type: 'email', message: 'Email no registrado'}
      }
      if(payload === "INVALID_PASSWORD"){
        return state.error = {type: 'password', message: 'Contraseña incorrecta'}
      }
      if(payload === "EMAIL_EXISTS"){
        return state.error = {type: 'email', message: 'Email ya registrado'}
      }
      if(payload === "INVALID_EMAIL"){
        return state.error = {type: 'email', message: 'Formato incorrecto de email'}
      }
    }
  },
  actions: {
    cerrarSesion({commit}){
      commit('setUser', null)
      localStorage.removeItem('usuario')
      router.push('/ingreso')
    },
    async addBovine({commit}, bovineData){
      try {
        const url = "http://"+BASE_URL+":"+BOVINE_PORT+"/v1/bovines/";
        // The data we are going to send in our request
        let data = {
          tag: bovineData.tag,
          description: bovineData.description,
          genre: bovineData.genre,
          taggingDate: bovineData.taggingDate
        }
        // The parameters we are gonna pass to the fetch function
        let fextchData = { 
          method: 'POST', 
          body: data,
          headers: new Headers()
        }
        const res = await fetch(fetchData);
        const bovinoDB = await res.json();
        console.log('Bovino:', bovinoDB);
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
  },
  getters: {
    isAuthenticated(state){
      return !!state.user
    }
  },
  modules: {
  }
})
