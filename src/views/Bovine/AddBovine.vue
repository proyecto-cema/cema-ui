<template>
  <div class="row text-center"  >
    <div class="offset-lg-2 col-10 col-lg-8 col-sm-10">

      <form @submit.prevent="procesarFormulario" style="border-radius: 10px;margin-top:100px; background: #ffffff;" class="borderDiv">
          <div style="background-color:black;padding-bottom: 1px;margin-bottom: 5px;">
            <h3 style="color:white">{{this.edicion?"Editar Bovino":"Registrar Bovino"}}</h3>
          </div>
          <div class="row">
            <div class="col-lg-4 col-sm-12">
              <div class="contenedor">
                <img src="../../assets/images/Bovine/tag_bovino.png" class="imageIdBovine" alt="Identificador" />
                <div class="TextCenterImage"><h4>{{bovine.tag}}</h4></div>
              </div>
            </div>
            <div class="col-lg-7 col-sm-12">
              <div class="row">
                <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                  <div class="textLeft"><label>Caravana</label></div>
                  <input 
                    type="text"
                    placeholder="Tag"
                    class="form-control marginButton"
                    v-model.trim="bovine.tag"
                    maxlength="10" required :readonly="edicion ? true : false"
                    :class="[errorSave.tag == true ? 'is-invalid' : '']"
                  >
                  <div class="textError" v-if="errorSave.tag==true">
                    <span :class="is-invalid" ></span> Ingrese el tag del bovino
                  </div>
                </div>
                <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                  <div class="textLeft"><label>Fecha de caravaneo</label></div>
                  <input 
                    type="date"
                    placeholder="Fecha"
                    class="form-control marginButton"
                    v-model.trim="bovine.taggingDate" required
                    :class="[errorSave.taggingDate == true ? 'is-invalid' : '']"
                  >
                  <div class="textError" v-if="errorSave.taggingDate==true">
                    <span class="is-invalid" ></span> Ingrese el fecha del caravaneo
                  </div>
                </div>
                <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                  <div class="textLeft"><label>Sexo</label></div>
                  <select id="sexo" v-model="bovine.genre" class="form-control invalid-arrow marginButton" :class="[errorSave.genre === true ? 'is-invalid' : '']" required>
                    <option value="" selected="selected">Seleccionar</option>
                    <option value="Masculino" selected="Masculino">Masculino</option>
                    <option value="Femenino" selected="Femenino">Femenino</option>
                  </select>
                  <div class="textError" v-if="errorSave.genre == true">
                    <span class="is-invalid" ></span> Seleccione el genero del bovino
                  </div>              
                </div>
                <div class="col-lg-12 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                  <div class="textLeft"><label>Descripción</label></div>
                  <textarea 
                    type="text" 
                    placeholder="Descripcion"
                    class="form-control marginButton"
                    v-model.trim="bovine.description"
                    required maxlength="300" rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="col-lg-10 offset-lg-1 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                <div class="alert alert-danger" v-if="error.type !== null">
                  {{error.message}}
                </div>
                <div class="alert alert-success alert-dismissible" v-if="succes !== null">
                  {{succes}}
                </div>
              </div>
              <div class="row">
                <div class="col-lg-2 offset-lg-6 col-sm-4 col-4" v-bind:class = "this.edicion?'offset-lg-6':'offset-lg-8 offset-sm-4 offset-4'">
                  <button type="button" class="btn btn-info text-white button-margin" data-bs-toggle="modal" data-bs-target="#SabeModal">
                    Guardar
                  </button>
                </div>
                <div class="col-lg-2 col-sm-4 col-4" v-if=(this.edicion)>
                  <div >
                    <button type="button" class="btn btn-danger text-white button-margin" data-bs-toggle="modal" data-bs-target="#DeleteModal">
                      Elimilar
                    </button>
                  </div>
                </div>
                <div class="col-lg-2 col-sm-4 col-4">
                  <button type="button" class="btn btn-dark text-white button-margin" data-bs-toggle="modal" data-bs-target="#CancelModal">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
      </form>
    </div>
  </div>
  


  <div class="modal fade" id="CancelModal" tabindex="-1" aria-labelledby="CancelModalLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="CancelModalLabel">Salir</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro que desea cancelar la acción en curso? Se cerrará la ventana y se perderán todos los cambios.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"> No </button>
          <router-link class="btn btn-dark text-white button-margin" to="/"> Si </router-link>
        
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="SabeModal" tabindex="-1" aria-labelledby="SabeModalLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="SabeModalLabel">Guardar</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Confirma que desea guardar los datos del bovino?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal"> No </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="GuardarBovino()"> Si </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="DeleteModal" tabindex="-1" aria-labelledby="DeleteModalLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="SabeModalLabel">Eliminar</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Confirma que desea eliminar bovino {{this.tag}}?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal"> No </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="BorrarBovino()"> Si </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AddBovine",
  data() {
    return {
      showModal:false,
      succes:null,
      edicion:false,
      errorSave:{
        tag:false,
        taggingDate:false,
        genre:false
      },
      
    };
  },
  mounted() {
    this.tag = this.$route.query.tag;
    if(this.tag==null || this.tag == "")
    {
      this.edicion=false;
    }else{
      this.edicion=true;
      this.BuscarBovino()
    }
  },
  computed: {
    ...mapState("bovine",["bovine"]),
    ...mapState("bovine",["error"]),
  },
  methods: {
    ...mapActions("bovine",["getBovine"]),
    ...mapActions("bovine",["saveBovine"]),
    ...mapActions("bovine",["deleteBovine"]),
    ...mapActions("bovine",["borrarDatos"]),

    
  
    async GuardarBovino() {
      this.showModal=true
      this.errorSave={};
      this.succes=null;
      if(this.bovine.tag==null || this.bovine.tag==""){
        this.errorSave.tag=true
        
      }
      if(this.bovine.genre==null || this.bovine.genre==""){
        this.errorSave.genre=true
        
      }
      if(this.bovine.taggingDate==null || this.bovine.taggingDate==""){
        this.errorSave.taggingDate=true
      }
      if(this.errorSave.taggingDate==true || this.errorSave.tag ==true ||this.errorSave.genre==true){
        console.log("error")
        return
      }
      await this.saveBovine({edicion:this.edicion,bovine:{tag: this.bovine.tag, taggingDate: this.bovine.taggingDate, genre:this.bovine.genre, description:this.bovine.description}});
      try {
        if (this.error !== null) {
          this.succes="El Bovino se guardo correctamente";
          this.edicion=false;
          this.borrarDatos();
          return;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async BuscarBovino(){
      this.errorSave={};
      this.succes=null;
      try {
        await this.getBovine({ tag: this.tag});
        
        if (this.error !== null) {
          return;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async BorrarBovino(){
      this.errorSave={};
      this.succes=null;
      try {
        await this.deleteBovine({ tag: this.tag});
        
        if (this.error !== null) {
          this.succes="El Bovino se elimino correctamente";
          this.borrarDatos();
          this.edicion=false;
          return;
        }
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
}
.marginSeccion{
    margin-bottom: 8px;
}
.borderDiv {
    border: solid;
    padding-left: 0px;
    padding-right: 0px;
}
.contenedor {
    position: relative;
    display: inline-block;
    text-align: center;
}
.textError {
    text-align: left !important;
    color:red;
    font-size: 14px;
}

</style>