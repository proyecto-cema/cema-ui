import { createStore } from 'vuex'
import router from '../router'
import {BASE_URL, BOVINE_PORT} from '../constants'

export default createStore({
  state: {
    bovine: '',
    user:'',
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
      if(payload === "Not found bovine"){
        return state.error = {tipo: 'general', mensaje: 'No se encuentra el bovino'}
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
    async saveBovine({commit},edicion, bovineData){
      try {
        if(edicion==true){
        }else{}
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
      } catch (error) {
        console.error(error);
      }
    },
    async getBovine({commit}, Bovine){
      try {
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + Buffer.from("cema:cema").toString('base64'));
        headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXJsaW4iLCJleHAiOjE2Mjk1Mjc4MjgsImlhdCI6MTYyOTUwOTgyOH0.gbv4X3TR5cP5y_UVQ0LKhSwtvtFvy8FMj3Yp5YQUhtQINQZSCfzlUFGWcpWa5rUjSrHi6_1fBSG5JPNfXYTbrQ');
        headers.append('Content-Type', 'application/json');
        const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/"+Bovine.tag,
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          headers: headers,
        });
        const bovinoDB = await res.json();
        console.log('Bovino:', bovinoDB);
        console.log(res)
        if(res.status===200)
        {
          commit('setBovine',bovinoDB)
          commit('setError','Server')
        }
        if(res.status === 404 || res.status === 401){
          console.log(res.statusText);
          return commit('setError', res.statusText);
        }
        commit('setError', null);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteBovine({commit}, Bovine){
      try {
        let headers = new Headers();
        //headers.append('Authorization', 'Basic ' + Buffer.from("cema:cema").toString('base64'));
        headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXJsaW4iLCJleHAiOjE2Mjk1Mjc4MjgsImlhdCI6MTYyOTUwOTgyOH0.gbv4X3TR5cP5y_UVQ0LKhSwtvtFvy8FMj3Yp5YQUhtQINQZSCfzlUFGWcpWa5rUjSrHi6_1fBSG5JPNfXYTbrQ');
        headers.append('Content-Type', 'application/json');
        const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/"+Bovine.tag,
        {
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          headers: headers,
        });
        const bovinoDB = await res.json();
        console.log('Bovino:', bovinoDB);
        console.log(res)
        if(res.status===200)
        {
          router.push('/');
        }
        if(res.status === 404 || res.status === 401){
          console.log(res.statusText);
          return commit('setError', res.statusText);
        }
        commit('setError', null);
      } catch (error) {
        console.error(error);
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
