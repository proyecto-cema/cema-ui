<template lang="">
        <h1 class="my-5">Ingreso de Usuarios</h1>
    <div class="alert alert-danger" v-if="error.tipo !== null">
      {{error.mensaje}}
    </div>
    <form @submit.prevent="procesarFormulario">
        <input 
            type="text"
            placeholder="Usuario"
            class="form-control my-2"
            v-model.trim="email"
            :class="[error.tipo === 'email' ? 'is-invalid' : '']"
        >
        <input 
            type="password" 
            placeholder="Contraseña"
            class="form-control my-2"
            v-model.trim="pass1"
            :class="[error.tipo === 'password' ? 'is-invalid' : '']"
        >
        <button 
            type="submit"
            class="btn btn-primary"
            :disabled="bloquear"
        >
            Ingresar
        </button>
    </form>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
    name: "Login",
  data() {
    return {
      email: "",
      pass1: "",
    };
  },
  computed: {
    bloquear() {
      if (this.pass1.length > 3) {
        return false;
      }
      return true;
    },
    ...mapState(['error'])
  },
  methods: {
    ...mapActions(["logUserIn"]),
    async procesarFormulario() {
      try {
        await this.logUserIn({ email: this.email, password: this.pass1 });
        if(this.error !== null) {

          return
        }
        this.email = "";
        this.pass1 = "";
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
<style lang="">
    
</style>