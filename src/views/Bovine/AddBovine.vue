<template>
  <NavBar/>
  <div class="row text-center"  >
    <!-- <div class="col-md-7 offset-md-5 col-lg-6 offset-lg-6 col-xl-5 offset-xl-7" style="margin-top:100px"> -->
    <div class="offset-lg-2 col-10 col-lg-8 col-sm-10">

      <form @submit.prevent="procesarFormulario" style="border-radius: 10px;margin-top:100px; background: #ffffff;">
          <div style="background-color:black;padding-bottom: 1px;margin-bottom: 5px;">
            <h3 style="color:white">{{this.titulo}}</h3>
          </div>
          <div class="row">
            <div class="col-lg-4 col-sm-12">
              <div class="contenedor">
                <img src="../../assets/images/Bovine/tag_bovino.png" class="imageIdBovine" alt="Identificador" />
                <div class="TextCenterImage"><h4>{{this.tag}}</h4></div>
              </div>
            </div>
            <div class="col-lg-7 col-sm-12">
              <div class="row">
                <div class="alert alert-danger" v-if="error.tipo !== null">
                  {{error.mensaje}}
                </div>
                <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1">
                  <div class="textLeft"><label>Caravana</label></div>
                  <input 
                    type="text"
                    placeholder="Tag"
                    class="form-control my-2 marginButton"
                    v-model.trim="tag"
                    maxlength="10" required
                  >
                </div>
                <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1">
                  <div class="textLeft"><label class="form-label">Fecha de caravaneo</label></div>
                  <input 
                  type="date" 
                  placeholder="Fecha"
                  class="form-control my-2 marginButton"
                  v-model.trim="taggingDate"
                  required
                  >
                </div>
                <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1">
                  <div class="textLeft"><label>Sexo</label></div>
                  <select id="sexo" v-model="genre" class="form-control invalid-arrow marginButton" required>
                    <option value="" selected="selected">Seleccionar</option>
                    <option value="Masculino" selected="Masculino">Masculino</option>
                    <option value="Femenino" selected="Femenino">Femenino</option>
                  </select>              
                </div>
                <div class="col-lg-12 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1">
                  <div class="textLeft"><label>Descripción</label></div>
                  <textarea 
                    type="text" 
                    placeholder="Descripcion"
                    class="form-control my-2 marginButton"
                    v-model.trim="description"
                    required maxlength="300" rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
              <button 
                type="button"
                v-on:click="EliminarBovino()"
                class="btn btn-warning text-white button-margin"
              >Elimilar</button> 
              <button 
                type="button"
                class="btn btn-info text-white button-margin"
                data-target=".sabe-modal"
              >Guardar</button>
              <button 
                type="button"
                class="btn btn-dark text-white button-margin"
              >Cancelar</button>
            
          </div>
      </form>
    </div>

    <!-- </div> -->
  </div>
  <div class="modal fade sabe-modal" tabindex="-1" role="dialog" aria-labelledby="SabeModal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p>¿Confirma que desea registrar los datos del bovino?</p>

                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-info" v-on:click="GuardarBovino()"> Si </button>
                    <button type="button" class="btn btn-dark" data-dismiss="modal"> No </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import NavBar from "../../components/NavBar.vue";

export default {
  name: "AddBovine",
  data() {
    return {
      titulo:"Registrar Bovino",
      tag: "",
      taggingDate: "",
      genre:"",
      description:""
    };
  },
  components:{
    NavBar
  }
  ,
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
    ...mapActions(["addBovine"]),
    ...mapActions(["getBovine"]),
    
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
    async EliminarBovino(){
      try {
        await this.getBovine({ tag: this.tag});
        
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
    }
  },
};
</script>
<style>
.TextCenterImage {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.imageIdBovine {
    width: 60% !important;
}
.textLeft {
    text-align: left !important;
}
.marginButton{
  margin-top: 0px !important;
  margin-bottom: 8px;
}
</style>