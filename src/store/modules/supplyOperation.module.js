import SupplyOperationService from '../../services/operation/supply-operation.service';

import utils from "../../utils"
import { SUPPLY_OPERATION_ERRORS } from '../../services/errors-common';

const state = {
    supplyOperation: {
        amount: null,
        description: null,
        establishmentCuig: null,
        id: null,
        operationType: "",
        operatorUserName: null,
        supplyName: null,
        transactionDate: null
    },
    edit: false
}

const mutations = {
    setSupplyOperation(state, payload) {
        state.supplyOperation = payload === null ? {
            amount: null,
            description: null,
            establishmentCuig: null,
            id: null,
            operationType: "",
            operatorUserName: null,
            supplyName: null,
            transactionDate: null
        } : payload
    },
    setEdit(state, value) {
        state.edit = value;
    }
}

const actions = {
    clearSupplyOperationData({ commit }) {
        commit('setSupplyOperation', null);
        commit('setEdit', false);
    },
    setupEditSupplyOperation({ commit }, proxySupplyOperation) {
        proxySupplyOperation.transactionDate = utils.methods.javaDateToMomentDate(proxySupplyOperation.transactionDate, 'YYYY-MM-DD');
        commit('setSupplyOperation', proxySupplyOperation);
        commit('setEdit', true);
    },
    async listSupplyOperations({ dispatch, rootState }, data) {
        return SupplyOperationService.listSupplyOperation(data.page, data.size).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", { error: error, errors: SUPPLY_OPERATION_ERRORS }, { root: true });
                return Promise.reject(error);
            }
        );
    },
    async getSupplyOperationAvailableForName({ dispatch, rootState }, name) {
        return SupplyOperationService.getSupplyOperationAvailable(name, rootState.auth.user.user.establishmentCuig).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", { error: error, errors: SUPPLY_OPERATION_ERRORS }, { root: true });
                return Promise.reject(error);
            }
        );
    },
    async saveSupplyOperation({ dispatch, rootState }, { edit, supplyOperation }) {
        supplyOperation.establishmentCuig = rootState.auth.user.user.establishmentCuig;
        let SupplyOperationToSave = Object.assign({}, supplyOperation);
        if (supplyOperation.operationType == 'Compra') {
            SupplyOperationToSave.operationType = 'buy'
        } else {
            if (supplyOperation.operationType == 'Consumo') {
                SupplyOperationToSave.operationType = 'use'
            } else {
                SupplyOperationToSave.operationType = 'loss'
            }
        }

        SupplyOperationToSave.operatorUserName = rootState.auth.user.user.userName;

        await SupplyOperationService.setSupplyOperation(SupplyOperationToSave, edit).then(
            () => {
                console.log(edit ? "Edited" : "Created", "supply-Operation:", supplyOperation)
                return Promise.resolve(supplyOperation);
            },
            error => {
                dispatch("showError", { error: error, errors: SUPPLY_OPERATION_ERRORS }, { root: true });
                return Promise.reject(error);
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