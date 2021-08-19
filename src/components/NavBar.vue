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
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a class="nav-link dropdown-toggle" href="#" id="dropdownBovinos" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Bovinos
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownBovinos">
              <li>
                <router-link class="nav-link" to="/bovinos/nuevo">
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
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a class="nav-link dropdown-toggle" href="#" id="dropdownActividades" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Actividades
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownActividades">
            </ul>
          </li>
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a class="nav-link dropdown-toggle" href="#" id="dropdownSalud" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Salud
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownSalud">
            </ul>
          </li>
          <li class="nav-item">
            <router-link
                class="nav-link"
                to="/login"
                v-if="!isAuthenticated"
            >
              Ingresar
            </router-link>
          </li>
          <li
              class="nav-item"
              v-if="isAuthenticated"
              @click="cerrarSesion"
          >
            <a class="nav-link">
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'NavBar',
    computed: {
        ...mapGetters("auth", ['isAuthenticated'])
    },
    methods: {
        ...mapActions("auth", ['logout'])
    }
}
</script>
<style lang="">
    
</style>