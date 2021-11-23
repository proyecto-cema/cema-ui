import LocationService from '../../services/administration/location.service';
import {LOCATION_ERRORS} from "../../constants";

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
        commit('setLocation', proxyLocation);
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
                dispatch("showError", {error: error, errors: LOCATION_ERRORS}, {root:true});
                return Promise.reject(error);
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
                dispatch("showError", {error: error, errors: LOCATION_ERRORS}, {root:true});
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