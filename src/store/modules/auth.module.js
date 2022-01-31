import AuthService from '../../services/auth/auth.service';
import {getHttpError} from "../../services/http-common";
import { LOGIN_ERRORS } from '../../services/errors-common';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };


const state = {
    ...initialState,
    error: {type: '', message: ''}
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
    setError(state, error) {
        return state.error = getHttpError(LOGIN_ERRORS, error.response.status);
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
                console.log(error);
                commit('setError', error);
                commit('loginFailure');
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
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}