<template>
  <nav class="navbar navbar navbar-expand-lg navbar-dark bg-dark d-flex" style="height: 6vh">
    <div class="container-fluid">
      <a class="navbar-brand">Nombre Establecimiento</a>
      <div class="navbar-nav flex-grow-1"></div>
      <div class="d-none d-sm-block mb-2 mb-lg-0">
        <ul v-if="!currentUser" class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">
              <font-awesome-icon icon="sign-in-alt" /> Ingresar
            </router-link>
          </li>
        </ul>
        <ul v-if="currentUser" class="navbar-nav">
          <li class="nav-item dropdown btn-group">
            <a class="nav-link dropdown-toggle" id="dropdownUser" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon icon="user" />
              {{ currentUser["user"]["name"] + ' ' + currentUser["user"]["lastName"] }}
            </a>
            <div class="dropdown-menu dropdown-menu-dark dropdown-menu-right" aria-labelledby="dropdownUser">
              <a class="nav-link dropdown-item" @click.prevent="logOut">
                <font-awesome-icon icon="sign-out-alt" /> Cerrar Sesión
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>

export default {
    name: 'NavBar',
    computed: {
      currentUser() {
        return this.$store.state.auth.user;
      },
    },
    methods: {
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