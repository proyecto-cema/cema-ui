import SupplyService from '../../services/administration/supply.service';
import { SUPPLY_ERRORS } from '../../services/errors-common';

const state = {
    supplyData: {
        name: "",
        units: "",
        price: "",
        categoryName:"",
        establishmentCuig: null,
    },
    edit: false
}

const mutations = {
    setSupply(state, payload) {
        state.supplyData = payload === null ? {
            name: "",
            units: "",
            price: "",
            categoryName:"",
            establishmentCuig: null,
        } : payload
    },
    setEdit(state, value){
        state.edit = value;
    }
}

const actions = {
    clearSupplyData({commit}) {
        commit('setSupply', null);
        commit('setEdit', false);
    },
    setupEditSupply({commit}, proxySupply){
        commit('setSupply', { previousName: proxySupply.name, ...proxySupply});
        commit('setEdit', true);
    },
    async getSupply({rootState},name){
        return SupplyService.getSupply(name, rootState.auth.user.user.establishmentCuig).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
            }
        ); 
        
    },
    async saveSupply({state, dispatch, rootState}){
        console.log(state.supplyData, "Editing: ", state.edit);
        if (!state.supplyData.establishmentCuig){
            state.supplyData.establishmentCuig = rootState.auth.user.user.establishmentCuig;
        }

        return SupplyService.setSupply(state.supplyData, state.edit).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
            }
        );
    },
    async listSupplies({dispatch, rootState}, data) {
        let search = {
            ...data.search,
            establishmentCuig: rootState.auth.user.user.establishmentCuig
        }
        console.log("DATASEARCH: ", data.search)
        return SupplyService.getSuppliesList(data.page, data.size, search).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
            }
        );
    },
    async deleteSupply({dispatch, rootState}, supply) {
        return SupplyService.deleteSupply(supply, supply.establishmentCuig).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
            }
        );
    },
    async makeDefaultSupply({dispatch}, supply){
        console.log(`Making ${supply} default.`)
        return SupplyService.setSupply({ ...supply, previousName: supply.name, isDefault: true }, true).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
            }
        );
    },
    async listCategories({dispatch}) {
        return SupplyService.getCategoriesList().then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
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