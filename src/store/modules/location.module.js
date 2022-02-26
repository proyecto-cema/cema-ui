import LocationService from '../../services/administration/location.service';
import { LOCATION_ERRORS } from '../../services/errors-common';

const state = {
    locationData: {
        name: "",
        description: "",
        size: 0,
        establishmentCuig: null,
    },
    edit: false
}

const mutations = {
    setLocation(state, payload) {
        state.locationData = payload === null ? {
            name: "",
            description: "",
            size: 0,
            establishmentCuig: null,
        } : payload
    },
    setEdit(state, value){
        state.edit = value;
    }
}

const actions = {
    clearLocationData({commit}) {
        commit('setLocation', null);
        commit('setEdit', false);
    },
    setupEditLocation({commit}, proxyLocation){
        commit('setLocation', { previousName: proxyLocation.name, ...proxyLocation});
        commit('setEdit', true);
    },
    async saveLocation({state, dispatch, rootState}){
        console.log(state.locationData, "Editing: ", state.edit);
        if (!state.locationData.establishmentCuig){
            state.locationData.establishmentCuig = rootState.bovine.selectedCuig;
        }

        return LocationService.setLocation(state.locationData, state.edit).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: LOCATION_ERRORS}, {root:true});
            }
        );
    },
    async listLocations({dispatch, rootState}) {
        return LocationService.listLocation(rootState.auth.user.user.establishmentCuig).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: LOCATION_ERRORS}, {root:true});
            }
        );
    },
    async deleteLocation({dispatch, rootState}, location) {
        return LocationService.deleteLocation(location, location.establishmentCuig).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: LOCATION_ERRORS}, {root:true});
            }
        );
    },
    async makeDefaultLocation({dispatch}, location){
        console.log(`Making ${location} default.`)
        return LocationService.setLocation({ ...location, previousName: location.name, isDefault: true }, true).then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: LOCATION_ERRORS}, {root:true});
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