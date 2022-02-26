import DiseaseService  from '../../services/health/disease.service';

import { DISEASE_ERRORS } from '../../services/errors-common';

const state = {
    disease: {
        name: null,
        description: null,
        establishmentCuig: null,
        duration: null
    },
    edit: false
}

const mutations = {
    setDisease(state, payload) {
        state.disease = payload === null ? {
            name: null,
            description: null,
            establishmentCuig: null,
            duration: null
        } : payload
    },
    setEdit(state, value){
        state.edit = value;
    }
}

const actions = {
    clearDiseaseData({commit}) {
        commit('setDisease', null);
        commit('setEdit', false);
    },
    setupEditDisease({commit}, proxyDisease){
        commit('setDisease', proxyDisease);
        commit('setEdit', true);
    },
    async saveDisease({state, dispatch, rootState}){
        console.log(state.disease, "Editing: ", state.edit);
        if (!state.disease.establishmentCuig){
            state.disease.establishmentCuig = rootState.auth.user.user.establishmentCuig;
        }
        return DiseaseService.setDisease(state.disease, state.edit).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: DISEASE_ERRORS}, {root:true});
            }
        );
    },
    async getDiseases({commit, dispatch}, data) {
        return DiseasesService.getDiseases(data.name,data.cuig).then(
            response => {
                let disease = response.data;
                console.log(disease)
                commit('setDiseases', disease);
                return Promise.resolve(disease);
            },
            error => {
                return dispatch("showError", {error: error, errors: ADMINISTRATION_ERRORS}, {root:true});
            }
        );
    },
    async listDiseases({dispatch, rootState},data) {
        return DiseaseService.listDisease(data.page, data.size).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: DISEASE_ERRORS}, {root:true});
            }
        );
    },
    async deleteDisease({commit, dispatch}, {name,cuig}) {
        return DiseaseService.deleteDisease(name, cuig).then(
            response => {
                console.log("Delete disease with name:", name)
                commit('setDisease', null);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: DISEASE_ERRORS}, {root:true});
            }
        );
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