import SupplyService from '../../services/administration/supply.service';
import {SUPPLY_ERRORS} from "../../constants";

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
    async saveSupply({state, dispatch, rootState}){
        console.log(state.supplyData, "Editing: ", state.edit);
        if (!state.supplyData.establishmentCuig){
            state.supplyData.establishmentCuig = rootState.bovine.selectedCuig;
        }

        return SupplyService.setSupply(state.supplyData, state.edit).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async listSupplies({dispatch}, data) {
        return SupplyService.getSuppliesList(data.page, data.size).then(
            response => {
                
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
                return Promise.reject(error);
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
                dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
                return Promise.reject(error);
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
                dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
                return Promise.reject(error);
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
                dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
                return Promise.reject(error);
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