import VaccineService from '../../services/health/vaccine.service';
import {ACTIVITY_ERRORS} from "../../constants";
import {getHttpError} from "../../services/http-common";
import utils from "../../utils"


const state = {
    vaccine: { id: null, batchName:null ,bovineTag:null , brand: null , dose: null , drug: null ,name: null ,executionDate:null, product:null , description: null , type: null, establishmentCuig: null},
    vaccineBovine: false,
    error: {type: null, message: null},
    edit: false
}

const mutations = {
    setVaccine(state, payload) {
        state.vaccine = payload === null ? {
            id:null,
            bovineTag: null,
            batchName:null,
            brand:null,
            dose: null, 
            drug:null,
            name:null,
            executionDate:null, 
            product: null, 
            description: null, 
            type:null,
            establishmentCuig:null
        } : payload
    },
    setError(state, error) {
        return state.error = getHttpError(ACTIVITY_ERRORS, error.response.status);
    },
    setErrorNull(state){
        state.error = {type: null, message: null};
    },
    setEdit(state, value){
        state.edit = value;
    },
    setVaccineBovine(state, value){
        state.vaccineBovine = value;
    }
}

const actions = {
    clearVaccineData({commit}) {
        let blankVaccine = {
            id:null,
            bovineTag: null,
            batchName:null,
            brand:null,
            dose: null, 
            drug:null,
            name:null,
            executionDate:null, 
            product: null, 
            description: null, 
            type:null
        }
        commit('setVaccine', blankVaccine);
        commit('setEdit', false);
        commit('setVaccineBovine', false);

    },
    dismissError({commit}){
        commit('setErrorNull');
    },
    setupEditVaccine({commit}, proxyVaccine){
        commit('setVaccine', proxyVaccine);
        commit('setEdit', true);
    },
    async getVaccine({commit}, tag) {
        return VaccineService.getVaccination(tag).then(
            response => {
                let vaccine = response.data;
                vaccine.executionDate = utils.methods.javaDateToMomentDate(vaccine.executionDate, 'YYYY-MM-DD');
                commit('setVaccine', vaccine);
                commit('setEdit', true);
                if(vaccine.batchName!=null){
                    commit('setVaccineBovine', false);
                }else{
                    commit('setVaccineBovine', true);
                }
                return Promise.resolve(vaccine);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async saveVaccine({commit, rootState}, {edit, vaccine}) {
        vaccine.establishmentCuig=rootState.auth.user.user.establishmentCuig;
        vaccine.type='Inoculation';
        let saveVaccine = Object.assign({}, vaccine);
        saveVaccine.executionDate = utils.methods.momentDateToJavaDate(vaccine.executionDate);
        return VaccineService.setVaccination(saveVaccine, edit).then(
            () => {
                console.log(edit ? "Edited": "Created", "Vaccine:", vaccine)
                return Promise.resolve(vaccine);
            },
            error => {
                commit('setError', error);
                return Promise.reject(error);
            }
        );
    },
    async deleteVaccine({commit, rootState, dispatch}, {tag, cuig}) {
        return VaccineService.deleteVaccination(tag, cuig).then(
            response => {
                console.log("Delete vaccine")
                dispatch("clearVaccineData");
                return Promise.resolve(response);
            },
            error => {
                commit('setError', error);
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