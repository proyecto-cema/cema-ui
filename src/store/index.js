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
    async ingresoUsuario({commit}, usuario){
      try {
        const res = await fetch("http://"+BASE_URL+":"+LOGIN_PORT+"/login/",{
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password
          })
        })
        const userDB = await res.json()
        console.log('Usuario:', userDB)
        if(userDB.error){
          console.log(userDB.error)
          return commit('setError', userDB.error.message)
        }
        commit('setUser', userDB)
        commit('setError', null)
        router.push('/')
      } catch (error) {
        console.error(error)  
      }
    },
  },
  getters: {
    usuarioAutenticado(state){
      return !!state.user
    }
  },
  modules: {
  }
})
