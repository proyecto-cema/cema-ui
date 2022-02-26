import EstablishmentService from "../services/administration/establishment.service";
import ActivityService from "../services/activity/activity.service";
import { getHttpError, getSuccessStructure, getErrorStructure, getWarningStructure } from '../services/http-common';
import { OFFLINE_CODE } from '../constants';

export default {
    setSideNav({ commit }) {
        commit('toggleSideNav');
    },
    setEstablishmentData({ commit }, cuig) {
        return EstablishmentService.getEstablishmentByCuig(cuig).then(
            response => {
                let establishment = response.data;
                console.log(establishment)
                commit('setEstablishment', establishment);
                return Promise.resolve(establishment);
            },
            error => {
                console.log("Error, please contact the devs if you consider this a mistake")
                console.error(error)
                return Promise.reject(error);
            }
        );
    },
    getEstablishmentData({ state, dispatch, rootState }){
        if (state.establishmentData === {}){
            dispatch("setEstablishmentData", rootState.auth.user.user.establishmentCuig);
        }
        return Promise.resolve(state.establishmentData);
    },
    removeIndexItemFromToasts({ commit }, index){
        console.log("Removing toast number", index);
        commit("removeFromDataToastsArray", index);
    },
    removeIndexItemFromNotifications({ commit }, index){
        console.log("Removing toast number", index);
        commit("removeFromNotificationsArray", index);
    },
    showSuccess({commit}, message){
        commit('appendToDataToastsArray', getSuccessStructure(message), { root: true });
    },
    showWarning({commit}, error){
        let toast = getWarningStructure(error.message);
        commit('appendToDataToastsArray', toast, { root: true });
        console.log(error);
        return Promise.reject(error);
    },
    showError({commit}, {errors, error}){
        let toast;
        console.log(error);
        if(!error.response){
            toast = getWarningStructure(error.config.method=='get'? 'No tenemos datos almacenados(offline) para tu petición.':null);
        }else{
            toast = getHttpError(errors, error.response.status);
        }
        commit('appendToDataToastsArray', toast, { root: true });
        console.log(error);
        return Promise.reject(error);
    },
    showErrorFront({commit}, message){
        commit('appendToDataToastsArray', getErrorStructure(message), { root: true });
        console.log(message);
    },
    getNotifications({ commit }, cuig){
        return ActivityService.getActivityNotifications(cuig).then(
            response => {
                let data = response.data;
                console.log(data)
                commit('appendToNotificationToasts', data, { root: true });
                return Promise.resolve(data);
            },
            error => {
                console.error(error)
                return Promise.reject(error);
            }
        );
    }
}
