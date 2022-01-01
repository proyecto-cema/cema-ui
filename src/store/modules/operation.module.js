import OperationService  from '../../services/operation/operation.service';
import BovineService from '../../services/bovines/bovine.service';

import {OPERATION_ERRORS,BOVINE_ERRORS} from "../../constants";
import utils from "../../utils"

const state = {
    operation: {
        amount: null,
        bovineTag: null,
        buyerName: null,
        description: null,
        establishmentCuig: null,
        operationType: "",
        operatorUserName: null,
        sellerName: null,
        transactionDate: null,
        id:null
    },
    extraData: {
        isSell: false
    },
    edit: false
}

const mutations = {
    setOperation(state, payload) {
        state.operation = payload === null ? {
            amount: null,
            bovineTag: null,
            buyerName: null,
            description: null,
            establishmentCuig: null,
            operationType: "",
            operatorUserName: null,
            sellerName: null,
            transactionDate: null,
            id:null
        } : payload
    },
    setEdit(state, value){
        state.edit = value;
    }
}

const actions = {
    clearOperationData({commit}) {
        commit('setOperation', null);
        commit('setEdit', false);
    },
    setupEditOperation({commit}, proxyOperation){
        proxyOperation.transactionDate = utils.methods.javaDateToMomentDate(proxyOperation.transactionDate, 'YYYY-MM-DD');
        commit('setOperation', proxyOperation);
        commit('setEdit', true);
    },
    async listOperations({dispatch, rootState},data) {
        return OperationService.listOperation(data.page, data.size).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: OPERATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async saveOperation({dispatch,rootState},{edit, operation}){
        let saveOperation = Object.assign({}, operation);
        saveOperation.establishmentCuig=rootState.auth.user.user.establishmentCuig;
        saveOperation.operatorUserName=rootState.auth.user.user.userName;
        // Borrar
        // saveBovine.taggingDate = utils.methods.momentDateToJavaDate(bovine.taggingDate);
        // saveBovine.birthDate =bovine.birthDate? utils.methods.momentDateToJavaDate(bovine.birthDate): null;
        // let saveBovine = Object.assign({}, bovine);

        OperationService.setOperation(saveOperation, edit).then(
            () => {
                console.log(edit ? "Edited": "Created", "Operation:", operation)
                Promise.resolve(operation);
                
            },
            error => {
                dispatch("showError", {error: error, errors: OPERATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
        //Borrar
        // BovineService.setBovine(saveBovine, editBovine).then(
        //     () => {
        //         console.log(editBovine ? "Edited": "Created", "bovine:", bovine)
        //         Promise.resolve(bovine);
                
        //     },
        //     error => {
        //         dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
        //         return Promise.reject(error);
        //     }
        // )
        
        
    }
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