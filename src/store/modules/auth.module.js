import router from "../../router";
import {BASE_URL, LOGIN_CONTEXT} from "../../constants";
import AuthService from '../../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };


const state = {
    status: initialState["status"],
    error: {type: null, message: null}
}

const mutations = {
    loginSuccess(state, user) {
        state.status.loggedIn = true;
        state.user = user;
    },
    loginFailure(state) {
        state.status.loggedIn = false;
        state.user = null;
    },
    logout(state) {
        state.status.loggedIn = false;
        state.user = null;
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
    login({ commit }, user) {
        return AuthService.login(user).then(
            user => {
                commit('loginSuccess', user);
                return Promise.resolve(user);
            },
            error => {
                if(error.response.status === 404 || error.response.status === 401){
                    console.log(error.response.statusText);
                    return commit('setError', error.response.statusText);
                }
                commit('loginFailure');
                console.log(error)
                return Promise.reject(error);
            }
        );
    },
    logout({ commit }) {
        AuthService.logout();
        commit('logout');
    },
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