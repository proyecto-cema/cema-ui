import UserService from '../../services/users/user.service';
import {ROLES} from "../../constants";
import utils from "../../utils"
import { USERS_ERRORS } from '../../services/errors-common';


const state = {
    user: {email: null, establishmentCuig: null, lastName: null, name: null, phone: null, role: "", userName: null},
    edit: false,
    userList: [],
}

const mutations = {
    setUser(state, payload) {
        state.user = payload === null ? {
            email: null,
            establishmentCuig: "",
            lastName: null, 
            name: null, 
            phone: null, 
            role: "",
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
        commit('setUser', null);
        commit('serEdit', false);
    },
    setupEditUser({commit}, user){
        console.log("user");
        console.log(user);
        if(user){
            let proxyUser = {...user, role: user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()};
            commit('setUser', proxyUser);
            commit('serEdit', true);
        }
    },
    async getUser({commit, dispatch}, userName) {
        return UserService.getUserByUserName(userName).then(
            response => {
                commit('setUser', response.data);
                return Promise.resolve(response.data);
            },
            error => {
                return dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
            }
        );
    },
    async newUser({dispatch}, data){
        return UserService.setUser(data.user, data.password).then(
          () => {
              console.log(data)
              return Promise.resolve(data);
          },
          error => {
              return dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
            });
    },
    async changeUser({dispatch, rootState}, { user, isSelf }){
        return UserService.changeUserData(user.userName, user).then(
          () => {
              console.log(user)
              if(isSelf){
                  rootState.auth.user.user = user;
              }
              return Promise.resolve(user);
          },
          error => {
              return dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
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
                return dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
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
                return dispatch("showError", {error: error, errors: USERS_ERRORS}, {root:true});
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