import ReportingService from '../../services/reporting/reporting.service';
import {REPORTING_ERRORS} from "../../constants";

const state = {
}

const mutations = {
}

const actions = {
    async retrieveReportData({dispatch}) {
        return ReportingService.getReport("batch").then(
            response => {
                console.log(response);
                return Promise.resolve(response);
            },
            error => {
                dispatch("showError", {error: error, errors: REPORTING_ERRORS}, {root:true});
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