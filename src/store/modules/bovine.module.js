import BovineService from '../../services/bovines/bovine.service';
import utils from "../../utils"
import { BATCH_ERRORS, BOVINE_ERRORS } from '../../services/errors-common';
import { OFFLINE_CODE } from '../../constants';


const state = {
    bovine: {tag: null, genre: "", description: null, taggingDate: null, establishmentCuig: null, batchNames: [], birthDate: null, category: "", status: "", illness:{} },
    listBovinesSelected:[],
    selectedCuig: null,
    cantSelect: null,
    edit: false,
    batch: {batchName: null, description: null, bovineTags: [], establishmentCuig: null},
    selectedImage: null
}

const mutations = {
    setBovine(state, payload) {
        console.log(payload);
        state.bovine = payload === null ? {
            tag: null,
            genre: "",
            description: null,
            taggingDate: null,
            establishmentCuig: null,
            batchNames: [],
            birthDate: null,
            category: "",
            status: "",
            illness:{}
        } : payload
    },
    setBovineSelected(state, payload){
        state.listBovinesSelected = payload === null? null : payload.list ;
        state.selectedCuig = payload === null? null : payload.cuig;
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
    },
    setSelectedCuig(state, payload){
        state.selectedCuig = payload;
    },
    setSelectedImage(state, payload){
        state.selectedImage = payload;
    },
}

const actions = {
    setupSelectedImage({commit}, payload){
        commit('setSelectedImage', payload);
    },
    setCuigToDefault({state, commit, rootState}){
        if(!state.selectedCuig){
            commit('setSelectedCuig', rootState.auth.user.user.establishmentCuig);
        }
    },
    clearBovineData({commit, rootState}) {
        let blankBovine = {
            tag: null,
            genre: "",
            description: null,
            taggingDate: null,
            lot:null,
            establishmentCuig: rootState.auth.user.user.establishmentCuig,
            batchNames: [],
            birthDate: null,
            category:"",
            status:"",
            illness:{}
        }
        commit('setBovine', blankBovine);
        commit('setEdit', false);
        commit('setSelectedImage', null)
    },
    setupEditBovine({commit}, proxyBovine){
        commit('setBovine', proxyBovine);
        commit('setEdit', true);
    },
    setupBatch({commit}, proxyBatch){
        commit('setBatch', proxyBatch);
    },
    setupListBovineSelected({commit}, {proxyListTag, cuig}){
        console.log("selected: ", cuig);
        commit('setBovineSelected', {list: proxyListTag, cuig: cuig});
    },
    setCuig({commit}, payload){
        commit('setSelectedCuig', payload);
    },
    async getBovine({commit, dispatch}, {tag, doCommit=true}) {
        return BovineService.getBovineByTag(tag).then(
            response => {
                let bovine = response.data;
                if(doCommit) {
                    bovine.taggingDate = utils.methods.javaDateToMomentDate(bovine.taggingDate, 'YYYY-MM-DD');
                    bovine.birthDate = utils.methods.javaDateToMomentDate(bovine.birthDate, 'YYYY-MM-DD');
                    commit('setBovine', bovine);
                }
                return Promise.resolve(bovine);
            },
            error => {
                return dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
            }
        );
    },
    async saveBovine({dispatch}, {edit, bovine}) {
        let saveBovine = Object.assign({}, bovine);
        saveBovine.taggingDate = utils.methods.momentDateToJavaDate(bovine.taggingDate);
        saveBovine.birthDate = bovine.birthDate? utils.methods.momentDateToJavaDate(bovine.birthDate): null;
        return BovineService.setBovine(saveBovine, edit).then(
            () => {
                console.log(edit ? "Edited": "Created", "bovine:", bovine)
                return Promise.resolve(bovine);
            },
            (error) => {
                if(!error.response){
                    return dispatch("showWarning", {
                        code: OFFLINE_CODE, bovine: bovine,
                        message: `El bovino ${bovine.tag} se creará cuando la conexión se restablezca.`,
                    }, {root:true});
                }
                return dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
            }
        )
    },
    async deleteBovine({dispatch}, {tag, cuig}) {
        return BovineService.deleteBovine(tag, cuig).then(
            response => {
                console.log("Delete bovine with cuig-tag:", cuig, '-',tag)
                dispatch("clearBovineData");
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
            }
        );
    },
    async listBovines({dispatch}, data) {
        return BovineService.getBovineList(data.page, data.size, data.search).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
            }
        );
    },
    async removeBovinesFromBatch({dispatch}, data) {
        console.log(data);
        return BovineService.removeBovinesFromBatch(data.batch, data.listBovinesSelected, data.cuig).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BATCH_ERRORS}, {root:true});
            }
        );
    },
    async listBatches({dispatch}) {
        console.log("retrieving batches for cuig:", state.selectedCuig)
        return BovineService.getBatchesList(state.selectedCuig).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BATCH_ERRORS}, {root:true});
            }
        );
    },
    async deleteBatch({dispatch}, {name, cuig}) {
        return BovineService.deleteBatch(name, cuig).then(
            response => {
                console.log("Delete batch with name:", name)
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BATCH_ERRORS}, {root:true});
            }
        );
    },
    async addBatchBovines({dispatch}, data) {
        return BovineService.addBovinesToBatch(data.batch, data.listBovinesSelected, state.selectedCuig).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BATCH_ERRORS}, {root:true});
            }
        );
    },
    async deleteBatchBovines({dispatch, rootState}, data) {
        return BovineService.deleteBovineToBatches(data.batchName, data.bovineTag, data.cuig).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BATCH_ERRORS}, {root:true});
            }
        );
    },
    async saveBatch({dispatch}, batch) {
        let data = {
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
                return dispatch("showError", {error: error, errors: BATCH_ERRORS}, {root:true});
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