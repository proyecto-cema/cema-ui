import router from "../../router";
import {BASE_URL, LOGIN_CONTEXT} from "../../constants";


const state = {
    user: '',
    error: {type: null, message: null}
}

const mutations = {
    setUser(state, payload){
        state.user = payload
    },
    setError(state, payload){
        if(payload === null) {
            return state.error = {type: null, message: null}
        }
        if(payload === "Unauthorized"){
            return state.error = {type: 'password', message: 'Contraseña incorrecta'}
        }
        if(payload === "Not Found"){
            return state.error = {type: 'UserPass', message: 'Usuario o Contraseña incorrectos'}
        }
        if(payload === "Server"){
            return state.error = {type: 'Server', message: 'ERROR en el servidor, intente nuevamente mas tarde.'}
        }
        return state.error = {type: 'Undefained', message: 'ERROR indefinido, intente nuevamente mas tarde.'}
    }
}

const actions = {
    logout({commit}){
        commit('setUser', null)
        localStorage.removeItem('username')
        router.push('/ingreso')
    },
    async logUserIn({commit}, userData){
        try {
            let headers = new Headers();
            headers.append('Authorization', 'Basic ' + Buffer.from("cema:cema").toString('base64'));
            headers.append('Content-Type', 'application/json');
            const res = await fetch(BASE_URL + LOGIN_CONTEXT +"/v1/users/login/"+userData.email+"?password="+userData.password,
                {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors',
                    headers: headers,
                });
            const userDB = await res.json();
            console.log('Usuario:', userDB);
            console.log(res)
            if(res.status === 404 || res.status === 401){
                console.log(res.statusText);
                return commit('setError', res.statusText);
            }
            commit('setUser', userDB.user);
            commit('setError', null);
            localStorage.setItem('username', JSON.stringify(userDB));
            await router.push('/');
        } catch (error) {
            commit('setError','Server')
            console.error(error);
        }
    },
    async loadLocalStorage({commit}) {
        if(localStorage.getItem('username')){
            commit('setUser', JSON.parse(localStorage.getItem('username')))
        }else{
            return commit('setUser', null)
        }
    }
}

const getters = {
    isAuthenticated(state) {
        return !!state.user
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}