import EstablishmentService from '../../services/administration/establishment.service';
import UsersService from '../../services/users/user.service';
import {getHttpError} from "../../services/http-common";
import {ADMINISTRATION_ERRORS} from "../../constants";

const state = {
    establishment: {name: null, cuig: null, location: null, phone: null, email: null, ownerUserName: "" },
    error: {type: null, message: null}
}

const mutations = {
    setEstablishment(state, payload) {
        state.establishment = payload === null ? { name: null, cuig: null, location: null, phone: null, email: null, ownerUserName: "" } : payload
        state.error = {type: null, message: null};
    },
    setError(state, error) {
        return state.error = getHttpError(ADMINISTRATION_ERRORS, error.response.status);
    }
}

const actions = {
    async getEstablishment({commit}, cuig) {
        return EstablishmentService.getEstablishmentByCuig(cuig).then(
            response => {
                let establishment = response.data;
                console.log(establishment)
                commit('setEstablishment', establishment);
                return Promise.resolve(establishment);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    clearEstablishmentData({commit}) {
        commit('setEstablishment', null)
    },
    async saveEstablishment({commit}, {edit, establishment}) {
        return EstablishmentService.setEstablishment(establishment, edit).then(
            establishment => {
                console.log(edit ? "Edited": "Created", "establishment:", establishment)
                return Promise.resolve(establishment);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async deleteEstablishment({commit}, cuig) {
        return EstablishmentService.deleteEstablishment(cuig).then(
            response => {
                console.log("Delete establishment with cuig:", cuig)
                commit('setEstablishment', null);
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async listOwners({commit}) {
        return UsersService.getOwnerList('patron').then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
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