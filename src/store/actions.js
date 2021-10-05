import EstablishmentService from "../services/administration/establishment.service";
import {getHttpError, getSuccessStructure} from "../services/http-common";
import {BOVINE_ERRORS} from "../constants";

export default {
    setSideNav({ commit }) {
        commit('toggleSideNav');
    },
    setEstablishmentName({ commit }, cuig) {
        return EstablishmentService.getEstablishmentByCuig(cuig).then(
            response => {
                let establishment = response.data;
                console.log(establishment)
                commit('setEstablishmentName', establishment);
                return Promise.resolve(establishment);
            },
            error => {
                console.log("Error, please contact the devs if you consider this a mistake")
                console.error(error)
                return Promise.reject(error);
            }
        );
    },
    removeIndexItemFromToasts({ commit }, index){
        console.log("Removing toast number", index);
        commit("removeFromDataToastsArray", index);
    },
    showSuccess({commit}, message){
        commit('appendToDataToastsArray', getSuccessStructure(message), { root: true });
    },
    showError({commit}, {errors, error}){
        commit('appendToDataToastsArray', getHttpError(errors, error.response.status), { root: true });
        console.log(error);
    },
}
