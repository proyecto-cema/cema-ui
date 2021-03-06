import ActivityService from '../../services/activity/activity.service';
import utils from "../../utils"
import { ACTIVITY_ERRORS, SUPPLY_ERRORS } from '../../services/errors-common';
import { ACTIVITIES_EXTRA_DATA, OFFLINE_CODE } from '../../constants';

const state = {
    activityData: {
        id: null,
        name: null,
        workerUserName: null,
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
            workerUserName: null,
            description: null,
            executionDate: null,
            type: "",
            extraData: {
                isBatch: false,
                result: "",
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
        if(saveActivity.hasOwnProperty("result")){
            saveActivity.result = saveActivity.result? saveActivity.result: null;
        }
        delete saveActivity.extraData;
        delete saveActivity.isBatch;
        saveActivity.executionDate = utils.methods.momentDateToJavaDate(state.activityData.executionDate);
        console.log("============");
        console.log(saveActivity);
        console.log("============");
        return ActivityService.setActivity(saveActivity, state.edit, url).then(
            response => {
                console.log(response);
                return Promise.resolve(response.data);
            },
            error => {
                if(!error.response){
                    return dispatch("showWarning", {
                        code: OFFLINE_CODE, activity: saveActivity,
                        message: `La actividad de ${ACTIVITIES_EXTRA_DATA[saveActivity.type].displayName} para la fecha ${state.activityData.executionDate} se guardar?? cuando la conexi??n se restablezca.`,
                    }, {root:true});
                }
                return dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
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
                return dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
            }
        );
    },
    async getActivity({commit, dispatch, rootState}, {id, url}) {
        return ActivityService.getActivity(id, rootState.bovine.selectedCuig, url).then(
            response => {
                let activityData = {
                    id: null,
                    name: null,
                    workerUserName: null,
                    description: null,
                    executionDate: null,
                    type: "",
                };
                let extraData = {};
                console.log("Got activity", response.data)
                for (const key in response.data) {
                    console.log(key);
                    if (activityData.hasOwnProperty(key)){
                        activityData[key] = response.data[key];
                    }else{
                        if(response.data[key]){
                            console.log("logging here", response.data[key]);
                            extraData[key] = response.data[key];
                            console.log(extraData);
                        }
                    }
                }
                activityData.executionDate = utils.methods.javaDateToMomentDate(activityData.executionDate, "YYYY-MM-DD");
                extraData["isBatch"] = extraData.hasOwnProperty("batchName");
                activityData["extraData"] = extraData;
                dispatch("setupEditActivity", activityData);
                console.log(activityData);
                return Promise.resolve(activityData);
            },
            error => {
                return dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
            }
        );
    },
    async getActivity2({commit, dispatch, rootState}, {id, url}) {
        return ActivityService.getActivity(id, rootState.bovine.selectedCuig, url).then(
            response => {
                commit('setActivity', response.data);
                return Promise.resolve(state.activityData);
            },
            error => {
                return dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
            }
        );
    },
    async listActivities({dispatch, rootState}, search) {
        return ActivityService.getActivitiesList(search.name, search.type, rootState.bovine.selectedCuig).then(
            response => {
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: ACTIVITY_ERRORS}, {root:true});
            }
        );
    },
    async getFeedingSupplyList({dispatch, rootState}, { page, size, search }){
        let searchingFor = {
            establishmentCuig: rootState.bovine.selectedCuig,
            categoryName: "comida",
            ...search
        };
        return ActivityService.getFeedingSupplies(page, size, searchingFor).then(
          response => {
              console.log("Supply list: " + response.data);
              return Promise.resolve(response);
          },
          error => {
              return dispatch("showError", {error: error, errors: SUPPLY_ERRORS}, {root:true});
          }
        );
    },
    async getWorkerList({dispatch}){
      return dispatch("user/listUsers", 1, { root: true });
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