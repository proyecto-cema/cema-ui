import BovineService from '../../services/bovines/bovine.service';
import {BOVINE_ERRORS} from "../../constants";
import {getHttpError} from "../../services/http-common";
import utils from "../../utils"


const state = {
    bovine: {tag: null, genre: "", description: null, taggingDate: null, establishmentCuig: null},
    error: {type: null, message: null},
    edit: false,
    batch: {batchName: null, description: null, bovineTags: [], establishmentCuig: null}
}

const mutations = {
    setBovine(state, payload) {
        state.bovine = payload === null ? {
            tag: null,
            genre: "",
            description: null,
            taggingDate: null,
            establishmentCuig: null
        } : payload
    },
    setError(state, error) {
        return state.error = getHttpError(BOVINE_ERRORS, error.response.status);
    },
    setErrorNull(state){
        state.error = {type: null, message: null};
    },
    setEdit(state, value){
        state.edit = value;
    },
    setBatch(state, payload){
        state.batch = payload === null ? {
            batchName: null,
            description: null,
            bovineTags: [],
            establishmentCuig: null
        } : payload

    }
}

const actions = {
    clearBovineData({commit, rootState}) {
        let blankBovine = {
            tag: null,
                genre: "",
            description: null,
            taggingDate: null,
            establishmentCuig: rootState.auth.user.user.establishmentCuig
        }
        commit('setBovine', blankBovine);
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
    async deleteBovine({commit, rootState, dispatch}, {tag, cuig}) {
        return BovineService.deleteBovine(tag, cuig).then(
            response => {
                console.log("Delete bovine with cuig-tag:", cuig, '-',tag)
                dispatch("clearBovineData");
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
    setupBatch({commit}, proxyBatch){
        commit('setBatch', proxyBatch);
    },
    async listBatches({commit}) {
        return BovineService.getBatchesList().then(
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
    async deleteBatch({commit, rootState, dispatch}, {name}) {
        return BovineService.deleteBatch(name , rootState.auth.user.user.establishmentCuig).then(
            response => {
                console.log("Delete batch with name:", name)
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async addBatchBovines({commit, rootState},data) {
        return BovineService.addBovineToBatch(data.batch , data.listBovinesSelected , rootState.auth.user.user.establishmentCuig).then(
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
    async deleteBatchBovines({commit , rootState},data) {
        return BovineService.deleteBovineToBatches(data.batchName , data.bovineTag, rootState.auth.user.user.establishmentCuig).then(
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
    async saveBatch({commit , rootState},batch) {
        let data={
            batchName : batch.name,
            bovineTags : batch.listBovinesSelected,
            description : batch.description,
            establishmentCuig : rootState.auth.user.user.establishmentCuig
        }
        return BovineService.setBatch(data).then(
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