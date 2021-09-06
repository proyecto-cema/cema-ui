import BovineService from '../../services/bovines/bovine.service';
import {BOVINE_ERRORS} from "../../constants";
import {getHttpError} from "../../services/http-common";
import utils from "../../utils"


const state = {
    bovine: {tag: null, genre: "", description: null, taggingDate: null, establishmentCuig: null},
    error: {type: null, message: null},
    edit: false
}

const mutations = {
    setBovine(state, payload) {
        state.bovine = payload === null ? {tag: null, genre: "", description: null, taggingDate: null, establishmentCuig: null} : payload
    },
    setError(state, error) {
        return state.error = getHttpError(BOVINE_ERRORS, error.response.status);
    },
    setErrorNull(state){
        state.error = {type: null, message: null};
    },
    setEdit(state, value){
        state.edit = value;
    }
}

const actions = {
    clearBovineData({commit}) {
        commit('setBovine', null);
        commit('setEdit', false);
    },
    dismissError({commit}){
        commit('setErrorNull');
    },
    setupEditBovine({commit}, proxyBovine){
        commit('setBovine', proxyBovine);
        commit('setEdit', true);
    },
    async getBovine({commit}, tag) {
        return BovineService.getBovineByTag(tag).then(
            response => {
                let bovine = response.data;
                bovine.taggingDate = utils.methods.javaDateToMomentDate(bovine.taggingDate, 'YYYY-MM-DD');
                commit('setBovine', bovine);
                return Promise.resolve(bovine);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async saveBovine({commit}, {edit, bovine}) {
        let saveBovine = Object.assign({}, bovine);
        saveBovine.taggingDate = utils.methods.momentDateToJavaDate(bovine.taggingDate);
        return BovineService.setBovine(saveBovine, edit).then(
            () => {
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