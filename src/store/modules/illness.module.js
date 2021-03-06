import IllnessService  from '../../services/health/illness.service';
import utils from "../../utils"

import { ILLNESS_ERRORS } from '../../services/errors-common';

const state = {
    illness: {
        bovineTag: null,
        diseaseName: null,
        endingDate: null,
        startingDate: null,
        establishmentCuig: null,
        id: "",
        notes:[]
        
    },
    edit: false
}

const mutations = {
    setIllness(state, payload) {
        state.illness = payload === null ? {
            bovineTag: null,
            diseaseName: null,
            endingDate: null,
            establishmentCuig: null,
            id: null,
            startingDate: null,
            notes:[]
        } : payload
    },
    setEdit(state, value){
        state.edit = value;
    },
    setId(state, value){
        state.illness.id = value;
    },
    setNote(state, value){
        state.illness.notes.push({content: value.content, creationDate: value.creationDate});
    }
}

const actions = {
    clearIllnessData({commit}) {
        commit('setIllness', null);
        commit('setEdit', false);
        commit('activity/setActivity', null, { root: true });
        commit('activity/setEdit', false, { root: true });
    },
    setupEditIllness({commit}, proxyIllness){
        commit('activity/setActivity', { extraData: { bovineTag: proxyIllness.bovineTag } }, { root: true });
        commit('setIllness', proxyIllness);
        commit('setEdit', true);
    },
    addObservationToList({commit},proxyNote){
        commit('setNote', proxyNote);
    },
    async saveIllness({commit, state, dispatch, rootState}){
        console.log(state.illness, "Editing: ", state.edit);
        let saveIllness = Object.assign({}, state.illness);
        saveIllness.endingDate = utils.methods.replaceFormat(saveIllness.endingDate, "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss")
        saveIllness.startingDate = utils.methods.replaceFormat(saveIllness.startingDate, "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss")
        console.log(state.illness, "Editing: ", state.edit);
        if (!saveIllness.establishmentCuig){
            saveIllness.establishmentCuig = rootState.auth.user.user.establishmentCuig;
        }
        return IllnessService.setIllness(saveIllness, state.edit).then(
            (response) => {
                commit('setId', response.data.id);
                console.log("save Illness", response);
                return Promise.resolve(response);
            },
            (error) => {
                if(error.response){
                    console.log(error.response);
                    if(error.response.status === 422 && error.response.data.message.includes("already")){
                        error.response.status = "special";
                    }
                }
                return dispatch("showError", {error: error, errors: ILLNESS_ERRORS}, {root:true});
            }
        );
    },
    async getIllnesses({commit, dispatch}, data) {
        return IllnessesService.getIllnesses(data.id, data.cuig).then(
            response => {
                let illness = response.data;
                illness.startingDate = utils.methods.javaDateToMomentDate(illness.startingDate, 'YYYY-MM-DD');
                illness.endingDate = utils.methods.javaDateToMomentDate(illness.endingDate, 'YYYY-MM-DD');

                console.log(illness)
                commit('setIllnesses', illness);
                return Promise.resolve(illness);
            },
            error => {
                return dispatch("showError", {error: error, errors: ILLNESS_ERRORS}, {root:true});
            }
        );
    },
    async listIllnesses({dispatch, rootState},data) {
        return IllnessService.listIllness(data.page, data.size).then(
            response => {
                
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: ILLNESS_ERRORS}, {root:true});
            }
        );
    },
    async deleteIllness({commit, dispatch}, {id}) {
        return IllnessService.deleteIllness(id).then(
            response => {
                console.log("Delete illness with id:", id)
                commit('setIllness', null);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: ILLNESS_ERRORS}, {root:true});
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