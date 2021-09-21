import BovineService from '../../services/bovines/bovine.service';
import {BOVINE_ERRORS} from "../../constants";
import {getHttpError} from "../../services/http-common";
import utils from "../../utils"


const state = {
    bovine: {tag: null, genre: "", description: null, taggingDate: null, establishmentCuig: null, batchNames: []},
    listBovinesSelected:[],
    selectedCuig: null,
    cantSelect: null,
    error: {type: null, message: null},
    edit: false
}

const mutations = {
    setBovine(state, payload) {
        state.bovine = payload === null ? {
            tag: null,
            genre: "",
            description: null,
            taggingDate: null,
            establishmentCuig: null,
            batchNames: []
        } : payload
    },
    setBovineSelected(state, payload){
        state.listBovinesSelected = payload === null? null : payload.list ;
        state.selectedCuig = payload === null? null : payload.cuig;
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
    clearBovineData({commit, rootState}) {
        let blankBovine = {
            tag: null,
            genre: "",
            description: null,
            taggingDate: null,
            lot:null,
            establishmentCuig: rootState.auth.user.user.establishmentCuig,
            batchNames: []
        }
        commit('setBovine', blankBovine);
        commit('setEdit', false);
    },
    dismissError({commit}){
        commit('setErrorNull');
    },
    setupEditBovine({commit}, proxyBovine){
        commit('setBovine', proxyBovine);
        //commit('setSelected', proxyBovine.length);
        commit('setEdit', true);
    },
    setupEdit({commit},edit){
        commit('setEdit', edit);

    },
    setupListBovineSelected({commit}, {proxyListTag, cuig}){
        console.log("selected: ", cuig);
        commit('setBovineSelected', {list: proxyListTag, cuig: cuig});
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
    async listBatches({commit}) {
        console.log("retrieving batches for cuig:", state.selectedCuig)
        return BovineService.getBatchesList(state.selectedCuig).then(
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
    async addBatchBovines({commit, rootState}, data) {
        return BovineService.addBovinesToBatch(data.batch, data.listBovinesSelected, state.selectedCuig).then(
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
    async removeBovinesFromBatch({commit , rootState}, data) {
        console.log(data);
        return BovineService.removeBovinesFromBatch(data.batch, data.listBovinesSelected, data.cuig).then(
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
    async saveBatch({commit, rootState}, batch) {
        let data={
            batchName: batch.name,
            bovineTags: batch.listBovinesSelected,
            description: batch.description,
            establishmentCuig: state.selectedCuig
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