import ActivityService from '../../services/activity/activity.service';
import {ACTIVITY_ERRORS} from "../../constants";
import utils from "../../utils"

const state = {
    activity: {
        id: null,
        name: null,
        description: null,
        executionDate: null,
        type: null,
        establishmentCuig: null,
        extraData: {}
    },
    edit: false
}

const mutations = {
    setActivity(state, payload) {
        state.activity = payload === null ? {
            id: null,
            name: null,
            description: null,
            executionDate: null,
            type: null,
            establishmentCuig: null,
            extraData: {}
        } : payload
    },
    setEdit(state, value){
        state.edit = value;
    }
}

const actions = {
    clearActivityData({commit}) {
        commit('setActivity', null);
        commit('setEdit', false);
    },
    setupEditActivity({commit}, proxyActivity){
        commit('setActivity', proxyActivity);
        commit('setEdit', true);
    },
    async saveActivity({commit, dispatch}) {
        let saveActivity = Object.assign({}, this.activity);
        saveActivity.executionDate = utils.methods.momentDateToJavaDate(this.activity.executionDate);
        return ActivityService.setActivity(saveActivity, this.edit).then(
            response => {
                console.log(response);
                return Promise.resolve(response.data);
            },
            error => {
                dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async deleteActivity({commit, dispatch, rootState}, {uuid}) {
        return ActivityService.deleteActivity(uuid, rootState.bovine.selectedCuig).then(
            response => {
                console.log("Deleted activity")
                dispatch("clearActivityData");
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
                return Promise.reject(error);
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