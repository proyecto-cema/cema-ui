import moment from "moment";
import {JAVA_DATE_FORMAT} from "./constants";

export default {
    methods: {
        javaDateToMomentDate(date, format = "DD/MM/YYYY") {
            return moment(String(date), JAVA_DATE_FORMAT).format(format);
        },
        momentDateToJavaDate(date, format = "YYYY-MM-DD") {
            return moment(String(date), format).format(JAVA_DATE_FORMAT);
        },
        getMomentToday(format="YYYY-MM-DD"){
            return moment().format(format);
        },
    }
}