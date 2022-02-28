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
        supplyName: "",
        transactionDate: null
    },
    availableSupply:null,
    price:null,
    totalOperation:null,
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
            supplyName: "",
            transactionDate: null
        } : payload
    },
    setEdit(state, value) {
        state.edit = value;
    },
    setAvailableSupply(state, value){
        state.availableSupply=value
    },
    setPrice(state, value){
        state.price=value
    },
    setTotalOperation(state, value){
        state.totalOperation=value
    }
}

const actions = {
    clearSupplyOperationData({ commit }) {
        commit('setSupplyOperation', null);
        commit('setEdit', false);
        commit('setAvailableSupply', null);
        commit('setPrice', null);
        commit('setTotalOperation', null);
    },
    setupEditSupplyOperation({ commit }, proxySupplyOperation) {
        proxySupplyOperation.transactionDate = utils.methods.javaDateToMomentDate(proxySupplyOperation.transactionDate, 'YYYY-MM-DD');
        commit('setSupplyOperation', proxySupplyOperation);
        commit('setEdit', true);
    },
    setupEditAvailableSupply({ commit }, proxyAvailableSupply) {
        commit('setAvailableSupply', proxyAvailableSupply);
    },
    setupEditPrice({ commit }, proxyPrice) {
        commit('setPrice', proxyPrice);
    },
    setupEditTotalOperation({ commit }, proxyTotalOperation) {
        commit('setTotalOperation', proxyTotalOperation);
    },
    async listSupplyOperations({ dispatch, rootState }, data) {
        return SupplyOperationService.listSupplyOperation(data.page, data.size).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", { error: error, errors: SUPPLY_OPERATION_ERRORS }, { root: true });
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
                return dispatch("showError", { error: error, errors: SUPPLY_OPERATION_ERRORS }, { root: true });
            }
        );
    },
    async saveSupplyOperation({ dispatch, rootState }, { edit, supplyOperation }) {
        supplyOperation.establishmentCuig = rootState.auth.user.user.establishmentCuig;
        let SupplyOperationToSave = Object.assign({}, supplyOperation);

        SupplyOperationToSave.operatorUserName = rootState.auth.user.user.userName;

        await SupplyOperationService.setSupplyOperation(SupplyOperationToSave, edit).then(
            () => {
                console.log(edit ? "Edited" : "Created", "supply-Operation:", supplyOperation)
                return Promise.resolve(supplyOperation);
            },
            error => {
                return dispatch("showError", { error: error, errors: SUPPLY_OPERATION_ERRORS }, { root: true });
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