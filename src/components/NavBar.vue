<template>
  <nav class="navbar navbar navbar-expand-lg navbar-dark bg-primary d-flex">
    <div class="container-fluid">
      <button
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        class="btn btn-dark d-inline-block ml-auto"
        :class="this.sidenav ? 'd-lg-none' : ''"
        data-target="#navbarSupportedContent"
        data-toggle="collapse"
        type="button"
        @click="toggleSideNav()"
      >
        <font-awesome-icon icon="align-justify" />
      </button>
      <a class="navbar-brand" :class="this.sidenav ? '' : 'd-none d-md-block'">{{ establishmentData.name }}</a>
      <div class="navbar-nav flex-grow-1"></div>
      <div class="d-none d-sm-block mb-2 mb-lg-0">
        <ul v-if="!currentUser" class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">
              <font-awesome-icon icon="sign-in-alt" />
              Ingresar
            </router-link>
          </li>
        </ul>
        <ul v-if="currentUser" class="navbar-nav">
          <li class="nav-item dropdown btn-group">
            <a
              id="dropdownUser"
              aria-expanded="false"
              aria-haspopup="true"
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              role="button"
            >
              <font-awesome-icon icon="user" />
              {{ currentUser['user']['name'] + ' ' + currentUser['user']['lastName'] }}
            </a>
            <div aria-labelledby="dropdownUser" class="dropdown-menu dropdown-menu-dark bg-primary dropdown-menu-end">
              <a class="nav-link dropdown-item" @click.prevent="showEstablishment" v-if="currentRole > 0">
                <font-awesome-icon class="ms-2" icon="building" />
                Mi Establecimiento
              </a>
              <a class="nav-link dropdown-item" @click.prevent="showUserData">
                <font-awesome-icon class="ms-2" icon="user" />
                Mi Perfil
              </a>
              <a class="nav-link dropdown-item" @click.prevent="showContactModal">
                <font-awesome-icon class="ms-2" icon="envelope" />
                Contáctanos
              </a>
              <a class="nav-link dropdown-item" @click.prevent="logOut">
                <font-awesome-icon class="ms-2" icon="sign-out-alt" />
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
import { mapActions, mapState } from 'vuex';
import { Modal } from 'bootstrap';
import { ROLE_REPRESENTATION } from '../constants';

export default {
  name: 'NavBar',
  data() {
    return {
      myUserModal: null,
    };
  },
  mounted() {
    if (this.currentUser) {
      this.setEstablishmentData(this.currentUser.user.establishmentCuig).then(
        () => {},
        (error) => {
          let jsonError = error.toJSON();
          console.log(jsonError);
          console.log('Logging Out because Error', error.response.status);
          if (jsonError.message === 'Network Error') {
            if (error.response.status === 503 || error.response.status === undefined) {
              console.log('Not able to reach server, not logging out');
              return;
            }
          }
          this.logOut();
        }
      );
      this.getNotifications(this.currentUser.user.establishmentCuig);
    }
    this.myUserModal = Modal.getOrCreateInstance(document.getElementById('myDataUserModal'));
    this.contactModal = Modal.getOrCreateInstance(document.getElementById('contactMeModal'));
  },
  computed: {
    ...mapState(['sidenav', 'establishmentData']),
    currentUser() {
      return this.$store.state.auth.user;
    },
    currentRole() {
      if (this.currentUser) {
        return ROLE_REPRESENTATION[this.currentUser.user.role.toUpperCase()];
      }
      return null;
    },
  },
  methods: {
    ...mapActions(['setSideNav', 'setEstablishmentData', 'getNotifications']),
    ...mapActions('user', ['setupEditUser']),
    toggleSideNav() {
      this.setSideNav();
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    showEstablishment() {
      this.$router.push({
        name: 'ListSubscriptions',
        params: { modal: true },
      });
    },
    showContactModal() {
      this.contactModal.show();
    },
    showUserData() {
      this.setupEditUser(this.currentUser.user);
      this.myUserModal.show();
    },
  },
};
</script>
<style>
.navbar-brand {
  transform: translateX(-50%);
  left: 50%;
  position: absolute;
}
</style>
