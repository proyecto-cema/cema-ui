import ReportingService from '../../services/reporting/reporting.service';
import {ADMINISTRATION_ERRORS, REPORTING_ERRORS, REPORTING_SELECTOR} from "../../constants";

const state = {
}

const mutations = {
}

function generateRandomColor(number){
    const hue = number * 137.508;
    return `hsla(${hue},50%,50%,`;
}

function prepareMultipleDataSets(list, values, displayNames) {
    let datasets = {};
    let labels = new Set();
    let color;
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        labels.add(element.year);
        for (let j = 0; j < values.length; j++) {
            if(!(values[j] in datasets)){
                color = generateRandomColor(j)
                datasets[values[j]] = {
                    label: `${displayNames[j]}`,
                    borderWidth: 1,
                    data: [],
                    backgroundColor: color+"0.2)",
                    borderColor: color+"1)"
                };
            }
            datasets[values[j]].data.push(element[values[j]]);
        }
    }
    return {labels: labels, datasets: datasets}
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
        color = generateRandomColor(i)
        datasets[0].backgroundColor.push(color+"0.2)");
        datasets[0].borderColor.push(color+"1)");
        datasets[0].data.push(element[value]);
    }
    return {labels: labels, datasets: datasets}
}

function prepareGroupedDataSets({ list, value, groupBy, multiple, displayNames }){
    if ( groupBy === undefined ){
        return prepareDataSets(list, value);
    } else if(multiple){
        return prepareMultipleDataSets(list, value, displayNames);
    }
    let datasets = {};
    let labels = new Set();
    let color;
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        labels.add(element.year);
        if( !(element[groupBy] in datasets)){
            color = generateRandomColor(i)
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