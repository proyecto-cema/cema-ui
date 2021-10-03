export default {
    toggleSideNav(state) {
        state.sidenav = !state.sidenav;
    },
    setEstablishmentName(state, payload) {
        state.establishmentName = payload.name;
    },
    setSuccessData(state, payload){
        state.successData = payload;
    },
    setErrorData(state, payload){
        state.errorData = payload;
    }
}
