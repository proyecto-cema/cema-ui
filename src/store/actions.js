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
            }
        );
    }
}
