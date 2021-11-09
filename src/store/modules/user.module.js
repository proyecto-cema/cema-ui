import UserService from '../../services/users/user.service';
import {ROLES, USERS_ERRORS} from "../../constants";
import utils from "../../utils"


const state = {
    user: {email: null, establishmentCuig: null, lastName: null, name: null, phone: null, role: null, userName: null},
    edit: false,
    userList: [],
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
    },
    serEdit(state, payload){
        state.edit = payload? payload:false;
    },
    setUserList(state, payload){
        state.userList = payload? payload:[];
    },
    extendUserList(state, payload){
        if(payload){
            state.userList.push(...payload);
        }
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
        commit('serEdit', false);
    },
    setupEditUser({commit}, user){
        let proxyUser = {...user, role: user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()};
        commit('setUser', user);
        commit('serEdit', true);
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
    },
    async listUsers({dispatch, state, commit}, role) {
        if(role > 0){
            console.log(role);
            dispatch("listUsers", role-1);
        }else{
            commit('setUserList', []);
        }
        return UserService.getUsersList(ROLES[role]).then(
            (response) => {
                console.log(response);
                commit('extendUserList', response.data);
                return Promise.resolve(state.userList);
            },
            error => {
                dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async deleteUser({dispatch}, data) {
        return UserService.deleteUser(data.userName).then(
            response => {
                console.log("Delete user with cuig-tag:",data.userName);
                dispatch("clearUserData");
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
}


const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}