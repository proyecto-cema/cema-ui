import OperationService from '../../services/operation/operation.service';
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
        isSell: true
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

        // saveOperation.operationData = utils.methods.momentDateToJavaDate(data.operationData);
        OperationService.setOperation(saveOperation, edit).then(
            () => {
                console.log(edit ? "Edited": "Created", "Operation:", operation)
                if(operation.operationType=='sell'){
                    // getBovine(operation.bovineTag)
                }
                else{

                }
                // return Promise.resolve(operation);
            },
            error => {
                dispatch("showError", {error: error, errors: OPERATION_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
        
    },
    async getBovine(bovineTag){
        var data
        
            BovineService.getBovineByTag(bovineTag).then(
                response => {
                    var bovine= response;
                    bovine.status="Vendido";
                    data={
                        edit:true,
                        bovine:bovine
                    }
                    this.saveBovine(data)    
                },
                error => {
                    dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
                    return Promise.reject(error);
                }        
            );
               
    },
    async saveBovine(data){
        BovineService.setBovine(data).then(
                () => {
                    console.log("Bovine: "+data)
                    // return Promise.resolve(operation);
                },
                error => {
                    dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
                    return Promise.reject(error);
                }
            ) 
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