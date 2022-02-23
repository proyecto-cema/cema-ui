
import AuditsService from '../../services/administration/audit.service';
import utils from "../../utils"
import { AUDIT_ERRORS } from '../../services/errors-common';


const state = {
    error: {type: '', message: ''}
}

const mutations = {
    setError(state, error) {
        return state.error = getHttpError(AUDIT_ERRORS, error.response.status);
    }
}

const actions = {
    async listAudits({dispatch}, data) {
        return AuditsService.getAuditsList(data.page, data.size).then(
            response => {
                
                console.log(response.data);
                return Promise.resolve(response);
            },
            error => {
                return dispatch("showError", {error: error, errors: BOVINE_ERRORS}, {root:true});
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