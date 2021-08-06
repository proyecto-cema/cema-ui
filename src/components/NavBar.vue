<template lang="">
    <div class="navbar navbar-dark bg-dark">
        <router-link to="/" class="navbar-brand">
            CEMA
        </router-link>
        <div class="d-flex">
            <router-link 
                class="btn btn-dark" 
                to="/"
                v-if="isAuthenticated"
            >
                Cargar Vaca
            </router-link>
            <router-link
                class="btn btn-dark"
                to="/login"
                v-if="!isAuthenticated"
            >
                Ingresar
            </router-link>
            <button 
                class="btn btn-dark"
                v-if="isAuthenticated"
                @click="cerrarSesion"
            >
                Cerrar Sesión
            </button>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'NavBar',
    computed: {
        ...mapGetters(['isAuthenticated'])
    },
    methods: {
        ...mapActions(['cerrarSesion'])
    }
}
</script>
<style lang="">
    
</style>