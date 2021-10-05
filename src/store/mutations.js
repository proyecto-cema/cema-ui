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
        let i;
        for (i = 0; i < arrLength; i++) {
            if (i in state.idToastHelper){
                console.log(`${i} exists`);
                if (!state.idToastHelper[i]) {
                    console.log(`${i} is false`);
                    break;
                }
            }else{
                console.log(`${i} doesn't exists`);
                break;
            }
        }
        console.log(state.dataToasts);
        console.log(state.idToastHelper);
        console.log("Adding", i);
        state.idToastHelper[i] = true;
        state.dataToasts.push({id: i, ...payload});
    },
    removeFromDataToastsArray(state, payload){
        for (let i = 0; i < state.dataToasts.length; i++) {
            if (state.dataToasts[i].id === payload){
                state.dataToasts.splice( i, 1);
                break;
            }
        }
        state.idToastHelper[payload] = false;
    }
}
