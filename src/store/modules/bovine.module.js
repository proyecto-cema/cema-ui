import BovineService from '../../services/bovines/bovine.service';
import moment from 'moment'


const state = {
    bovine: {tag: null, genre: "", description: null, taggingDate: null},
    error: {type: null, message: null}
}

const mutations = {
    setBovine(state, payload) {
        state.bovine = payload === null ? {tag: null, genre: "", description: null, taggingDate: null} : payload
        state.error = {type: null, message: null};
    },
    setError(state, payload) {
        let message = 'ERROR indefinido, intente nuevamente mas tarde.';
        switch (payload){
            case null:
                return state.error = {type: null, message: null};
            case "Unauthorized":
                message = 'No esta autorizado';
                break;
            case "Conflict":
                message = 'El bovino que esta intentando registrar ya existe';
                break;
            case "Not Found":
                message = 'Bovino no encontrado';
                break;
            case "Server":
                message = 'ERROR en el servidor, intente nuevamente mas tarde.';
                break;

        }
        return state.error = {type: 'Server', message: message}
    }
}

const actions = {
    async getBovine({commit}, tag) {
        return BovineService.getBovineByTag(tag).then(
            response => {
                let bovine = response.data;
                bovine.taggingDate = moment(String(bovine.taggingDate)).format('YYYY-MM-DD');
                commit('setBovine', bovine);
                return Promise.resolve(bovine);
            },
            error => {
                if(error.status === 404 || error.status === 401){
                    commit('setError', error.statusText);
                }
                console.error(error);
                return Promise.reject(error);
            }
        );
    },
    clearBovineData({commit}) {
        commit('setBovine', null)
    },
    async saveBovine({commit}, {edit, bovine}) {
        return BovineService.setBovine(bovine, edit).then(
            bovine => {
                console.log(edit ? "Edited": "Created", "bovine:", bovine)
                return Promise.resolve(bovine);
            },
            error => {
                if([404, 401, 409].includes(error.status)){
                    commit('setError', error.statusText);
                }
                console.error(error);
                return Promise.reject(error);
            }
        );
    },
    async deleteBovine({commit}, tag) {
        return BovineService.deleteBovine(tag).then(
            response => {
                console.log("Delete bovine with tag:", tag)
                commit('setBovine', null);
                return Promise.resolve(response);
            },
            error => {
                if(error.status === 404 || error.status === 401){
                    commit('setError', error.statusText);
                }
                console.error(error);
                return Promise.reject(error);
            }
        );
    },
    async listBovines({commit}, page, size, searchParams) {
        return BovineService.getBovineList(page, size, searchParams).then(
            response => {
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                if(error.status === 404 || error.status === 401){
                    commit('setError', error.statusText);
                }
                console.error(error);
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