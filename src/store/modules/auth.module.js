import AuthService from '../../services/auth/auth.service';
import {getHttpError} from "../../services/http-common";
import {ADMINISTRATION_ERRORS, LOGIN_ERRORS} from "../../constants";

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };


const state = {
    ...initialState,
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
                commit('setErrorData', getHttpError(LOGIN_ERRORS, error.response.status), { root: true });
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