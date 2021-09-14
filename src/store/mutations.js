export default {
    toggleSideNav(state) {
        state.sidenav = !state.sidenav;
    },
    setEstablishmentName(state, payload) {
        state.establishmentName = payload.name;
    }
}
