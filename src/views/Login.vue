<template lang="">
  <div class="row text-center"  >
    <div class="col-md-7 offset-md-5 col-lg-6 offset-lg-6 col-xl-5 offset-xl-7" style="margin-top:100px">
      <form @submit.prevent="procesarFormulario" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5);">
        <div class="col-md-10 offset-md-1">
          <img src="../assets/images/Logo_cema.png" style="width: 75%;" alt="Logo CEMA"/>
          <div class="alert alert-danger" v-if="error.tipo !== null">
            {{error.mensaje}}
          </div>
          <input 
              type="text"
              placeholder="Usuario"
              class="form-control my-2"
              v-model.trim="user"
              :class="[error.tipo === 'user' ? 'is-invalid' : '']"
          >
          <input 
              type="password" 
              placeholder="Contraseña"
              class="form-control my-2"
              v-model.trim="pass"
              :class="[error.tipo === 'pass' ? 'is-invalid' : '']"
          >
          <div class="row">
            <div class="col-lg-5 col-md-12" style="padding-top:8px;">
              <input type="checkbox" id="cbox2" value="true"> <label style="color:white" for="cbox2">Recuerdame</label>
            </div>
            <div class="col-lg-7 col-md-12 negrita in-line">
              <a class="nav-link text-info in-line negrita" v-on:click="Redirect" >¿Olvidaste tu contraseña?</a>
            </div>
          </div>
          <button 
              type="submit"
              class="btn btn-dark text-white button-margin"
          >Iniciar Sesión</button>
          <div class="row" style="padding-bottom:15px;" >
            <div class="col-md-7 in-line " style="padding-top:8px;">
              <label style="color:white">¿Por primera vez en <b>CEMA</b>?</label>
            </div>
            <div class="col-md-5 in-line negrita">
              <a class="nav-link text-info">Suscribete ya</a>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";


export default {
  name: "Login",
  data() {
    return {
      user: "",
      pass: ""
    };
  },
  computed: {
    bloquear() {
      if (this.pass.length > 3) {
        return false;
      }
      return true;
    },
    ...mapState(["error"]),
  },
  methods: {
    ...mapActions(["logUserIn"]),
    Redirect(){
      this.$router.push('/');
    },
    async procesarFormulario() {
      this.error=null;
      if(this.user==null || this.user==""){
        this.error.tipo="user"
        this.error.mensaje="Debe ingregar su usuario"
        return
      }
      if(this.pass==null || this.pass==""){
        this.error.tipo="pass"
        this.error.mensaje="Por favor ingrese su contraseña"
        return
      }
      try {
        await this.logUserIn({ user: this.user, password: this.pass });
        if (this.error !== null) {
          return;
        }
        this.user = "";
        this.pass = "";
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style>
.imagen-fondo{
  background-image: url("../assets/images/Fondo_login.png");
}
.Portada {
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
}
.in-line{
    padding-left: 0px;
    padding-right: 0px;
}
.button-margin{
  margin-top: 10px;
  margin-bottom: 10px;
}
.negrita{
  font-weight: bold;
}
</style>