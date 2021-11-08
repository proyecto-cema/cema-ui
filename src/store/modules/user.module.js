import UserService from '../../services/users/user.service';
import {USERS_ERRORS} from "../../constants";
import utils from "../../utils"


const state = {
    user: {email: null, establishmentCuig: null, lastName: null, name: null, phone: null, role: null, userName: null},
    edit: false
}

const mutations = {
    setUser(state, payload) {
        state.user = payload === null ? {
            email: null,
            establishmentCuig: null, 
            lastName: null, 
            name: null, 
            phone: null, 
            role: null, 
            userName: null
        }: payload
    }
}

const actions = {
    clearUserData({commit}) {
        let blankUser =  {
            email: null,
            establishmentCuig: null, 
            lastName: null, 
            name: null, 
            phone: null, 
            role: null, 
            userName: null
        }
        commit('setUser', blankUser);
    },
    async getUser({commit, dispatch}, userName) {
        return UserService.getUserByUserName(userName).then(
            response => {
                commit('setUser', response.data);
                return Promise.resolve(response.data);
            },
            error => {
                dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async saveUser({dispatch}, data) {
        data.user=data.user
        return UserService.setUser(data.user, data.password).then(
            () => {
                console.log(data)
                return Promise.resolve(data);
            },
            error => {
                dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    }
}


const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}