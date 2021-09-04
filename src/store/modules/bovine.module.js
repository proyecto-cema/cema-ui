import BovineService from '../../services/bovines/bovine.service';
import moment from 'moment'
import {BOVINE_ERRORS} from "../../constants";
import {getHttpError} from "../../services/http-common";


const state = {
    bovine: {tag: null, genre: "", description: null, taggingDate: null, establishmentCuig: null},
    error: {type: null, message: null}
}

const mutations = {
    setBovine(state, payload) {
        state.bovine = payload === null ? {tag: null, genre: "", description: null, taggingDate: null, establishmentCuig: null} : payload
        state.error = {type: null, message: null};
    },
    setError(state, error) {
        return state.error = getHttpError(BOVINE_ERRORS, error.response.status);
    }
}

const actions = {
    async getBovine({commit}, tag) {
        return BovineService.getBovineByTag(tag).then(
            response => {
                let bovine = response.data;
                bovine.taggingDate = moment(String(bovine.taggingDate)).format('YYYY-MM-DD');
                commit('setBovine', bovine);
                return Promise.resolve(bovine);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    clearBovineData({commit}) {
        commit('setBovine', null)
    },
    async saveBovine({commit}, {edit, bovine}) {
        return BovineService.setBovine(bovine, edit).then(
            bovine => {
                console.log(edit ? "Edited": "Created", "bovine:", bovine)
                return Promise.resolve(bovine);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async deleteBovine({commit}, tag) {
        return BovineService.deleteBovine(tag).then(
            response => {
                console.log("Delete bovine with tag:", tag)
                commit('setBovine', null);
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async listBovines({commit}, data) {
        return BovineService.getBovineList(data.page, data.size, data.search).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
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