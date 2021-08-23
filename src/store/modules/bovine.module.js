import AuthService from '../../services/auth/auth.service';
import {BASE_URL, BOVINE_CONTEXT, LOGIN_CONTEXT} from '../../constants'
import moment from 'moment'


const state = {
    bovine:{tag:null,genre:"",description:null,taggingDate:null},
    error: {type: null, message: null}
}

const mutations = {
    setBovine(state, payload){
        if(payload===null)
        {
            state.bovine={tag:null,genre:"",description:null,taggingDate:null}
        }else{
            state.bovine = payload
        }
    },
    setError(state, payload){
        if(payload === null) {
            return state.error = {type: null, message: null}
        }
        if(payload === "Unauthorized"){
            return state.error = {type: 'Server', message: 'No esta autorizado'}
        }
        if(payload === "Conflict"){
            return state.error = {type: 'Server', message: 'El bovino que esta intentando registrar ya existe'}
        }
        if(payload === "Not Found"){
            return state.error = {type: 'Server', message: 'Bovino no encontrado'}
        }
        if(payload === "Server"){
            return state.error = {type: 'Server', message: 'ERROR en el servidor, intente nuevamente mas tarde.'}
        }
        return state.error = {type: 'Server', message: 'ERROR indefinido, intente nuevamente mas tarde.'}
    }
}

const actions = {
    async getBovine({commit}, Bovine){
        try {
          let headers = new Headers();
          //headers.append('Authorization', 'Basic ' + Buffer.from("cema:cema").toString('base64'));
          headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZ3VzIiwiZXhwIjoxNjI5NzY4NDY1LCJpYXQiOjE2Mjk3NTA0NjV9.N3j084Lv_J1EP-7mCn13kNK4W3j7kBdW11JoODwpNZGsD2ZHnhn1ksBfVaAbQBbazxWa3EmbgwxDFpAzhSvRFA');
          headers.append('Content-Type', 'application/json');
          const res = await fetch(BASE_URL+":30024/v1/bovines/"+Bovine.tag,
          {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: headers,
          });
          const bovinoDB = await res.json();
          bovinoDB.taggingDate=moment(String(bovinoDB.taggingDate)).format('YYYY-MM-DD');
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
    borrarDatos({commit}){
        commit('setBovine',null)
    },
    async saveBovine({commit},Data){
      try {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZ3VzIiwiZXhwIjoxNjI5NzY4NDY1LCJpYXQiOjE2Mjk3NTA0NjV9.N3j084Lv_J1EP-7mCn13kNK4W3j7kBdW11JoODwpNZGsD2ZHnhn1ksBfVaAbQBbazxWa3EmbgwxDFpAzhSvRFA');
        headers.append('Content-Type', 'application/json');
        
        if(Data.edicion==true){
          const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/"+Data.bovine.tag,
          {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: headers,
            body:JSON.stringify(Data.bovine)
          });
          const bovinoDB = await res.json();
          console.log('Bovino:', null);
          console.log(res)
          if(res.status === 404 || res.status === 401){
            console.log(res.statusText);
            return commit('setError', res.statusText);
          }
        }else{
          const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/",
          {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: headers,
            body:JSON.stringify(Data.bovine)
          });
          const bovinoDB = await res.json();
          console.log('Bovino:', bovinoDB);
          
          console.log(res)
          if(res.status === 404 || res.status === 401){
            console.log(res.statusText);
            return commit('setError', res.statusText);
          }
          if(res.status === 409){
            console.log(res.statusText);
            return commit('setError', res.statusText);
          }

        }
        commit('setBovine',null);
        commit('setError', null);
      } catch (error) {
        console.error(error);
      };
    },
    async deleteBovine({commit}, Bovine){
      try {
        let headers = new Headers();
        //headers.append('Authorization', 'Basic ' + Buffer.from("cema:cema").toString('base64'));
        headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZ3VzIiwiZXhwIjoxNjI5NzY4NDY1LCJpYXQiOjE2Mjk3NTA0NjV9.N3j084Lv_J1EP-7mCn13kNK4W3j7kBdW11JoODwpNZGsD2ZHnhn1ksBfVaAbQBbazxWa3EmbgwxDFpAzhSvRFA');
        headers.append('Content-Type', 'application/json');
        const res = await fetch("http://"+BASE_URL+":30024/v1/bovines/"+Bovine.tag,
        {
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          headers: headers,
        });
        console.log(res)
        if(res.status === 404 || res.status === 401){
          console.log(res.statusText);
          return commit('setError', res.statusText);
        }
        commit('setBovine',null);
        commit('setError', null);
      } catch (error) {
        console.error(error);
      }
    },
}


const getters = {
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}