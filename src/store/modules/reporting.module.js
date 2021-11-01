import ReportingService from '../../services/reporting/reporting.service';
import {REPORTING_ERRORS} from "../../constants";

const state = {
}

const mutations = {
}

const actions = {
    async retrieveReportData({ dispatch }, { name, yearsTo, decrement }) {
        let yearsFrom = Number.parseInt(yearsTo) - decrement;
        return ReportingService.getReport(name, yearsFrom, yearsTo).then(
            response => {
                console.log(response);
                return Promise.resolve(response.data.reportedList);
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