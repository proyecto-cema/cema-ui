import BovineOperationService  from '../../services/operation/bovine-operation.service';

import utils from "../../utils"
import { OPERATION_ERRORS } from '../../services/errors-common';

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
        id: null
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
            id: null
        } : payload
    },
    setEdit(state, value){
        state.edit = value;
    },
    setIsSell(state, payload){
        state.extraData.isSell = payload === 'sell';
    }
}

const actions = {
    clearOperationData({commit}) {
        commit('setOperation', null);
        commit('setIsSell', null);
        commit('setEdit', false);
    },
    setupEditOperation({commit}, proxyOperation){
        proxyOperation.transactionDate = utils.methods.javaDateToMomentDate(proxyOperation.transactionDate, 'YYYY-MM-DD');
        commit('setOperation', proxyOperation);
        commit('setIsSell', proxyOperation.operationType);
        commit('setEdit', true);
    },
    async listOperations({dispatch, rootState},data) {
        return BovineOperationService.listOperation(data.page, data.size).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: OPERATION_ERRORS}, {root:true});
            }
        );
    },
    async saveOperation({dispatch, rootState}, {edit, operation}){
        operation.establishmentCuig = rootState.auth.user.user.establishmentCuig;
        let saveOperation = Object.assign({}, operation);
        saveOperation.operatorUserName = rootState.auth.user.user.userName;

        return BovineOperationService.setOperation(saveOperation, edit).then(
            () => {
                console.log(edit ? "Edited": "Created", "Operation:", operation)
                return Promise.resolve(operation);
            },
            error => {
                return dispatch("showError", {error: error, errors: OPERATION_ERRORS}, {root:true});
            }
        );
    },
    async getOperationMetrics({dispatch, rootState}){
        return BovineOperationService.getOperationTotals(rootState.auth.user.user.establishmentCuig).then(
          (response) => {
              return Promise.resolve(response.data);
          },
          error => {
              return dispatch("showError", {error: error, errors: OPERATION_ERRORS}, {root:true});
          }
        );
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