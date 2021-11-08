import moment from "moment";
import {JAVA_DATE_FORMAT} from "./constants";

export default {
    methods: {
        javaDateToMomentDate(date, format = "DD/MM/YYYY", dateOnly=false) {
            let trueDate = moment(String(date), JAVA_DATE_FORMAT);
            if(dateOnly){
                return trueDate.toDate();
            }
            return trueDate.format(format);
        },
        momentDateToJavaDate(date, format = "YYYY-MM-DD") {
            return moment(String(date), format).format(JAVA_DATE_FORMAT);
        },
        replaceFormat(date, format1 = "DD/MM/YYYY", format2 = "YYYY-MM-DD") {
            return moment(String(date), format1).format(format2);
        },
        getMomentToday(format="YYYY-MM-DD"){
            return moment().format(format);
        },
    }
}