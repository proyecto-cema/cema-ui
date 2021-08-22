import { createStore } from 'vuex'
import router from '../router'
import {BASE_URL, BOVINE_CONTEXT, LOGIN_CONTEXT} from '../constants'


export default createStore({
  state: {
    token:'',
    user: '',
    bovine:'',
    error: {tipo: null, mensaje: null}
  },
  mutations: {
    setToken(state, payload){
      state.token = payload
    },
    setBovine(state, payload){
      state.bovine = payload
    },
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
        let headers = new Headers();
        //headers.append('Authorization', 'Basic ' + Buffer.from("cema:cema").toString('base64'));
        headers.append('Content-Type', 'application/json');
        const res = await fetch("http://"+BASE_URL+":30023/v1/authenticate",
        {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          headers: headers,
          body:JSON.stringify(userData)
        });
        const userDB = await res.json();
        console.log("token:"+userDB.token)
        if(res.status === 404 || res.status === 401){
          console.log(res.statusText);
          return commit('setError', res.statusText);
        }
        commit('setToken',userDB.token)
        commit('setError', null);
        router.push('/');
      } catch (error) {
        commit('setError','Unauthorized')
        console.error(error);
      }
      
    },
    async loadLocalStorage({commit, state}) {
      if(localStorage.getItem('usuario')){
        commit('setUser', JSON.parse(localStorage.getItem('usuario')))
      }else{
        return commit('setUser', null)
      }
    },
    async getBovine({commit}, Bovine){
      try {
        let headers = new Headers();
        //headers.append('Authorization', 'Basic ' + Buffer.from("cema:cema").toString('base64'));
        headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXJsaW4iLCJleHAiOjE2Mjk1NzU5NDMsImlhdCI6MTYyOTU1Nzk0M30.QatjiEA5FFZWXSw3CmdazKNLWGlFC4W3w7OniaqNnt09y0MqhdBDKg3NKH-6rp5PvG3sTBarMNd3Rc4fWU-e7g');
        headers.append('Content-Type', 'application/json');
        console.log(BASE_URL+"   context: "+ BOVINE_CONTEXT )
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
        headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXJsaW4iLCJleHAiOjE2Mjk1NzU5NDMsImlhdCI6MTYyOTU1Nzk0M30.QatjiEA5FFZWXSw3CmdazKNLWGlFC4W3w7OniaqNnt09y0MqhdBDKg3NKH-6rp5PvG3sTBarMNd3Rc4fWU-e7g');
        headers.append('Content-Type', 'application/json');
        const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/"+Bovine.tag,
        {
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          headers: headers,
        });
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
    },
    async saveBovine({commit},Data){
      try {
        if(Data.edicion==true){
          const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/"+Data.bovive.tag,
          {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: headers,
            body:JSON.stringify(Data.bovine)
          });
        }else{
          const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/",
          {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: headers,
            body:JSON.stringify(Data.bovine)
          });
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
