<template>
  <nav class="navbar navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <img src="../assets/images/cema_logo.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <div v-if="currentUser" class="navbar-nav me-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="dropdownBovines" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Bovinos
              </a>
              <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownBovines">
                <li>
                  <router-link class="nav-link" to="/bovinos/formulario">
                    Cargar Bovino
                  </router-link>
                </li>
                <li>
                  <router-link class="nav-link" to="/bovinos/listado">
                    Listar Bovinos
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="dropdownActivities" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Actividades
              </a>
              <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownActivities">
              </ul>
            </li>
            <li class="nav-item dropdown" >
              <a class="nav-link dropdown-toggle" href="#" id="dropdownHealth" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Salud
              </a>
              <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownHealth">
              </ul>
            </li>
          </div>

          <div v-if="!currentUser" class="navbar-nav">
            <li class="nav-item">
              <router-link
                  class="nav-link"
                  to="/login"
              >
                Ingresar
              </router-link>
            </li>
          </div>

          <div v-if="currentUser" class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <font-awesome-icon icon="user" />
                {{ currentUser["userName"] }}
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click.prevent="logOut">
                <font-awesome-icon icon="sign-out-alt" /> Cerrar Sesión
              </a>
            </li>
          </div>
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
<style lang="">
    
</style>