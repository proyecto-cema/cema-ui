<template lang="">
  <div class="row text-center"  >
    <div class="col-md-7 offset-md-5 col-lg-6 offset-lg-6 col-xl-5 offset-xl-7" style="margin-top:100px">
      <form @submit.prevent="procesarFormulario" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5);">
        <div class="col-md-10 offset-md-1">
          <div class="alert alert-danger" v-if="error.tipo !== null">
            {{error.mensaje}}
          </div>
          <input 
              type="text"
              placeholder="Tag"
              class="form-control my-2"
              v-model.trim="tag"
          >
          <input 
              type="text" 
              placeholder="sexo"
              class="form-control my-2"
              v-model.trim="genre"
          >
          <input 
              type="text" 
              placeholder="Fecha"
              class="form-control my-2"
              v-model.trim="taggingDate"
          >
          <input 
              type="text" 
              placeholder="descripcion"
              class="form-control my-2"
              v-model.trim="description"
          > 
          <button 
              type="submit"
              class="btn btn-dark text-white button-margin"
          >Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AddBovine",
  data() {
    return {
      tag: "",
      taggingDate: "",
      genre:"",
      description:""
    };
  },
  computed: {
    bloquear() {
      if (this.pass1.length > 3) {
        return false;
      }
      return true;
    },
    ...mapState(["error"]),
  },
  methods: {
    // ...mapActions(["logUserIn"]),
    async GuardarBovino() {
      try {
        await this.addBovine({ tag: this.tag, taggingDate: this.taggingDate, genre:this.genre, description:this.description });
        if (this.error !== null) {
          return;
        }
        this.tag = "";
        this.date = "";
        this.sex = "";
        this.description = "";
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style>

</style>