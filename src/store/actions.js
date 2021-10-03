import EstablishmentService from "../services/administration/establishment.service";

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
    setMessageData({ commit }, data, isError) {
        if(isError){
            commit('setErrorData', data);
        } else {
            commit('setSuccessData', data);
        }
    },
}
