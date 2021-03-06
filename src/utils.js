import moment from "moment";
import { JAVA_DATE_FORMAT, JAVA_DATETIME_FORMAT, REGEX_LETTERS_NUMBERS } from './constants';


export default {
    methods: {
        javaDateToMomentDate(date, format = "DD/MM/YYYY", dateOnly=false, useDateTime=false) {
            if (date === null){ return null }
            let trueDate = moment(String(date), useDateTime ? JAVA_DATETIME_FORMAT:JAVA_DATE_FORMAT);
            if(dateOnly){
                return trueDate.toDate();
            }
            return trueDate.format(format);
        },
        momentDateToJavaDate(date, format = "YYYY-MM-DD"){
            return moment(String(date), format).toISOString(true);
        },
        replaceFormat(date, format1 = "DD/MM/YYYY", format2 = "YYYY-MM-DD") {
            console.log(date);
            console.log(String(date));
            let momentDate = moment(String(date), format1)
            console.log(momentDate.format(format2).toString());
            return momentDate.format(format2).toString();
        },
        getMomentToday(format="YYYY-MM-DD"){
            return moment().format(format);
        },
        checkErrors(errorSave){
            for (const key in errorSave) {
                if (!errorSave.hasOwnProperty(key)) continue;
                if (errorSave[key]) return true;
            }
            return false;
        },
        tagHasError(tag) {
            let message = 'Ingrese el número de caravana del bovino.';
            let isValid = !!tag;
            let testRegex = REGEX_LETTERS_NUMBERS.test(tag);
            if (isValid && !testRegex) {
              message = 'La caravana ingresada no es valida. Solo se permiten numeros y letras.';
              isValid = false;
            }
            return { isValid: isValid, message: message };
        },
        parsePageHeaders(headers){
            return {
                totalPages: parseInt(headers['total-pages']) || 0,
                currentPage: parseInt(headers['current-page']) || 0,
                totalElements: parseInt(headers['total-elements']) || 0
            }
        }
    }
}