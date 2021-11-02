import ReportingService from '../../services/reporting/reporting.service';
import {ADMINISTRATION_ERRORS, REPORTING_ERRORS, REPORTING_SELECTOR} from "../../constants";

const state = {
}

const mutations = {
}

function randomMax(max){
    return Math.floor(Math.random() * max);
}

function generateRandomColor(){
    return `rgba(${randomMax(255)}, ${randomMax(255)}, ${randomMax(255)},`
}

function prepareDataSets(list, value) {
    let datasets = {
        0: {
            borderWidth: 1,
            data: [],
            backgroundColor: [],
            borderColor: []
        }
    };
    let labels = new Set();
    let color;
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        labels.add(element.year);
        color = generateRandomColor()
        datasets[0].backgroundColor.push(color+"0.2)");
        datasets[0].borderColor.push(color+"1)");
        datasets[0].data.push(element[value]);
    }
    return {labels: labels, datasets: datasets}
}

function prepareGroupedDataSets({ list, groupBy, value }){
    if ( groupBy === null ){
        return prepareDataSets(list, value);
    }
    let datasets = {};
    let labels = new Set();
    let color;
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        labels.add(element.year);
        if( !(element[groupBy] in datasets)){
            color = generateRandomColor()
            datasets[element[groupBy]] = {
                label: `${element[groupBy]}`,
                borderWidth: 1,
                data: [],
                backgroundColor: color+"0.2)",
                borderColor: color+"1)"
            };
        }
        datasets[element[groupBy]].data.push(element[value]);
    }
    return {labels: labels, datasets: datasets}
}

const actions = {
    async retrieveReportData({ dispatch }, { name, yearsTo, decrement, arrangeData = true }) {
        let yearsFrom = Number.parseInt(yearsTo) - decrement;
        return ReportingService.getReport(name, yearsFrom, yearsTo).then(
            response => {
                console.log(response);
                let returnData = response.data.reportedList;
                if (arrangeData){
                    returnData = prepareGroupedDataSets({ list: response.data.reportedList, ...REPORTING_SELECTOR[name] });
                }
                return Promise.resolve(returnData);
            },
            error => {
                dispatch("showError", {error: error, errors: REPORTING_ERRORS}, {root:true});
                return Promise.reject(error);
            }
        );
    },
}


const getters = {
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}