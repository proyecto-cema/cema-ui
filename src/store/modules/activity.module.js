import ActivityService from '../../services/activity/activity.service';
import {ACTIVITY_ERRORS} from "../../constants";
import utils from "../../utils"

const state = {
    activityData: {
        id: null,
        name: null,
        description: null,
        executionDate: null,
        type: null,
        extraData: {
            isBatch: false
        }
    },
    edit: false
}

const mutations = {
    setActivity(state, payload) {
        state.activityData = payload === null ? {
            id: null,
            name: null,
            description: null,
            executionDate: null,
            type: "",
            extraData: {
                isBatch: false
            }
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
    async saveActivity({state, dispatch, rootState}, url) {
        console.log(state.activityData, "Editing: ", state.edit);
        let saveActivity = {
            establishmentCuig: rootState.bovine.selectedCuig,
            ...state.activityData,
            ...state.activityData.extraData,
        };
        delete saveActivity.extraData;
        delete saveActivity.isBatch;
        saveActivity.executionDate = utils.methods.momentDateToJavaDate(state.activityData.executionDate);
        return ActivityService.setActivity(saveActivity, state.edit, url).then(
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
    async deleteActivity({dispatch, rootState}, {id, url}) {
        return ActivityService.deleteActivity(id, rootState.bovine.selectedCuig, url).then(
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
    async getActivity({dispatch, rootState}, {id, url}) {
        return ActivityService.getActivity(id, rootState.bovine.selectedCuig, url).then(
            response => {
                console.log("Got activity", response.data)
                for (const key in response.data) {
                    if (state.activityData.hasOwnProperty(key)){
                        state.activityData[key] = response.data[key];
                    }else{
                        state.activityData.extraData[key] = response.data[key];
                    }
                }
                state.saveActivity["isBatch"] = state.activityData.hasOwnProperty("batch_name");
                return Promise.resolve(state.activityData);
            },
            error => {
                dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
    async listActivitys({dispatch}) {
        return ActivityService.getActivitysList().then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    }
}


const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}