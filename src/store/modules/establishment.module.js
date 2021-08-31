import EstablishmentService from '../../services/Administration/establishment.service';
import UsersService from '../../services/users/user.service';

const state = {
    establishment: {name: null, cuig: null, location: null, phone: null, email: null, ownerUserName: "" },
    error: {type: null, message: null}
}

const mutations = {
    setEstablishment(state, payload) {
        state.establishment = payload === null ? { name: null, cuig: null, location: null, phone: null, email: null, ownerUserName: "" } : payload
        state.error = {type: null, message: null};
    },
    setError(state, error) {
        let message = 'ERROR indefinido, intente nuevamente mas tarde.';
        let payload;
        if(error.response){
            if([404, 401, 409].includes(error.response.status)){
                payload = error.response.statusText;
            }
        }else{
            payload = error.message;
        }
        console.error(error);
        switch (payload){
            case null:
                return state.error = {type: null, message: null};
            case "Unauthorized":
                message = 'No esta autorizado';
                break;
            case "Conflict":
                message = 'El establecimiento que esta intentando registrar ya existe';
                break;
            case "Not Found":
                message = 'Establecimiento no encontrado';
                break;
            case "Server":
                message = 'ERROR en el servidor, intente nuevamente mas tarde.';
                break;

        }
        return state.error = {type: 'Server', message: message}
    }
}

const actions = {
    async getEstablishment({commit}, cuig) {
        return EstablishmentService.getEstablishmentByCuig(cuig).then(
            response => {
                let establishment = response.data;
                console.log(establishment)
                commit('setEstablishment', establishment);
                return Promise.resolve(establishment);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    clearEstablishmentData({commit}) {
        commit('setEstablishment', null)
    },
    async saveEstablishment({commit}, {edit, establishment}) {
        return EstablishmentService.setEstablishment(establishment, edit).then(
            establishment => {
                console.log(edit ? "Edited": "Created", "establishment:", establishment)
                return Promise.resolve(establishment);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async deleteEstablishment({commit}, cuig) {
        return EstablishmentService.deleteEstablishment(cuig).then(
            response => {
                console.log("Delete establishment with cuig:", cuig)
                commit('setEstablishment', null);
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async listOwners({commit},role) {
        return UsersService.getOwnerList(role).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
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