import {MAXIMUM_TOASTS} from "../constants";

export default {
    toggleSideNav(state) {
        state.sidenav = !state.sidenav;
    },
    setEstablishmentName(state, payload) {
        state.establishmentName = payload.name;
    },
    appendToDataToastsArray(state, payload){
        let arrLength = state.dataToasts.length;
        if(arrLength > MAXIMUM_TOASTS){
            state.dataToasts.splice( 0, arrLength - MAXIMUM_TOASTS);
        }
        state.dataToasts.push(payload);
    },
    removeFromDataToastsArray(state, payload){
        state.dataToasts.splice( payload, 1);
    }
}
