<template>
  <nav class="navbar navbar navbar-expand-lg navbar-dark bg-primary d-flex">
    <div class="container-fluid">
      <button aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation" class="btn btn-dark d-inline-block ml-auto"
              :class="this.sidenav ? 'd-lg-none':''"
              data-target="#navbarSupportedContent" data-toggle="collapse"
              type="button" v-on:click="toggleSideNav()">
        <font-awesome-icon icon="align-justify"/>
      </button>
      <a class="navbar-brand" :class="this.sidenav ? '': 'd-none d-md-block'">{{establishmentName}}</a>
      <div class="navbar-nav flex-grow-1"></div>
      <div class="d-none d-sm-block mb-2 mb-lg-0">
        <ul v-if="!currentUser" class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">
              <font-awesome-icon icon="sign-in-alt"/>
              Ingresar
            </router-link>
          </li>
        </ul>
        <ul v-if="currentUser" class="navbar-nav">
          <li class="nav-item dropdown btn-group">
            <a id="dropdownUser" aria-expanded="false" aria-haspopup="true" class="nav-link dropdown-toggle"
               data-bs-toggle="dropdown" role="button">
              <font-awesome-icon icon="user"/>
              {{ currentUser["user"]["name"] + ' ' + currentUser["user"]["lastName"] }}
            </a>
            <div aria-labelledby="dropdownUser" class="dropdown-menu dropdown-menu-dark bg-primary dropdown-menu-end">
              <a class="nav-link dropdown-item" @click.prevent="logOut">
                <font-awesome-icon class="ms-2" icon="sign-out-alt"/>
                Cerrar Sesión
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>

import {mapActions, mapState} from "vuex";

export default {
  name: 'NavBar',
  mounted() {
    if (this.currentUser) {
      this.setEstablishmentName(this.currentUser.user.establishmentCuig).then(
          () => {},
          (error) => {
            console.log("Logging Out because Error", error.response.status);
            if(error.response.status === 503){
              console.log("Not able to reach server, not logging out");
              return
            }
            this.logOut();
          }
      );
    }
  },
  computed: {
    ...mapState(['sidenav', 'establishmentName']),
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    ...mapActions(['setSideNav', 'setEstablishmentName']),
    toggleSideNav() {
      this.setSideNav();
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>
<style>
.navbar-brand {
  transform: translateX(-50%);
  left: 50%;
  position: absolute;
}
</style>