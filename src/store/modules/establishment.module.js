import EstablishmentService from '../../services/administration/establishment.service';
import UsersService from '../../services/users/user.service';
import { ADMINISTRATION_ERRORS } from '../../services/errors-common';

const state = {
    establishment: {name: null, cuig: null, location: null, phone: null, email: null, ownerUserName: "" },
    edit: false,
}

const mutations = {
    setEstablishment(state, payload) {
        state.establishment = payload === null ? { name: null, cuig: null, location: null, phone: null, email: null, ownerUserName: "" } : payload
    },
    setEdit(state, payload) {
        state.edit = payload === null ? false : payload
    }
}

const actions = {
    setupEditMyEstablishment({dispatch}){
      dispatch("getEstablishmentData", null, {root:true}).then(
        (establishment) => {
          dispatch("setupEditEstablishment", establishment);
        }
      );
    },
    setupEditEstablishment({commit}, establishment){
        commit('setEdit', true);
        commit('setEstablishment', establishment);
    },
    async getEstablishment({commit, dispatch}, cuig) {
        return EstablishmentService.getEstablishmentByCuig(cuig).then(
            response => {
                let establishment = response.data;
                console.log(establishment)
                commit('setEstablishment', establishment);
                return Promise.resolve(establishment);
            },
            error => {
                dispatch("showError", {error: error, errors: ADMINISTRATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    clearEstablishmentData({commit}) {
        commit('setEdit', false);
        commit('setEstablishment', null);
    },
    async saveEstablishment({dispatch, state}, {establishment}) {
        console.log(establishment, state.edit);
        return EstablishmentService.setEstablishment(establishment, state.edit).then(
            (data) => {
                console.log(state.edit ? "Edited": "Created", "establishment:", data)
                return Promise.resolve(establishment);
            },
            error => {
                dispatch("showError", {error: error, errors: ADMINISTRATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async deleteEstablishment({commit, dispatch}, {cuig}) {
        return EstablishmentService.deleteEstablishment(cuig).then(
            response => {
                console.log("Delete establishment with cuig:", cuig)
                commit('setEstablishment', null);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: ADMINISTRATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async listOwners({dispatch}) {
        return UsersService.getOwnerList('patron').then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: ADMINISTRATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async listEstablishments({dispatch}) {
        return EstablishmentService.getEstablishmentList().then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: ADMINISTRATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async listSubscriptions({dispatch, rootState}, {page, size}) {
      let cuig = rootState.auth.user.user.establishmentCuig;
        return EstablishmentService.getSubscriptionsList(cuig, page, size).then(
          response => {
              console.log(response.data);
              return Promise.resolve(response);
          },
          error => {
              dispatch("showError", {error: error, errors: ADMINISTRATION_ERRORS}, {root:true});
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