<template>
  <div class="row text-center"  >
    <div class="offset-lg-2 col-lg-8 offset-md-1 col-md-10   col-sm-12">
      <form @submit.prevent="procesarFormulario" style="border-radius: 10px;margin-top:100px; background: #ffffff;" class="borderDiv">
        <div>
          <div style="background-color:black;padding-bottom: 1px;margin-bottom: 5px;">
            <h3 style="color:white">Listado Bovinos</h3>
          </div>
          <div class="col-10 offset-1">
            <div class="row">
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Caravana</label></div>
                  <input 
                  type="text"
                  placeholder="Tag"
                  class="form-control marginButton"
                  v-model.trim="bovine.tag"
                  maxlength="10" required
                >
              </div>
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Fecha de caravaneo</label></div>
                <input 
                  type="date"
                  placeholder="Fecha"
                  class="form-control marginButton"
                  v-model.trim="bovine.taggingDate"
                >
              </div>
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Sexo</label></div>
                <select id="sexo" v-model="bovine.genre" class="form-control invalid-arrow marginButton">
                  <option value="" selected="selected">Seleccionar</option>
                  <option value="Masculino" selected="Masculino">Masculino</option>
                  <option value="Femenino" selected="Femenino">Femenino</option>
                </select>   
              </div>
              <div class="col-12 col-md-6" style="margin-top: 15px;">
                <button type="button" class="btn btn-info text-white button-margin" style="float: left;" data-bs-toggle="modal" data-bs-target="#SabeModal">
                   Buscar    
                </button>
                <button type="button" class="btn btn-info text-white button-margin" style="float: right;" data-bs-toggle="modal" data-bs-target="#SabeModal">
                  Agregar Nuevo    
                </button>  
              </div>
              <div class="col-12">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">TAG</th>
                      <th scope="col">Genero</th>
                      <th scope="col">Descripcion</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th >123</th>
                      <td>Masculino</td>
                      <td>Otto</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th >124</th>
                      <td>Masculino</td>
                      <td>Thornton</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th >125</th>
                      <td>Masculino</td>
                      <td>the Bird</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div> 
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
  name: "ListBovine",
  data() {
    return {
      fields: ['first_name', 'last_name', 'age'],
      bovines: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' }
      ],
      bovine:[{}]
    };
  },
  computed: {
    ...mapState("bovine", ["bovine"]),
    ...mapState("bovine", ["error"]),
    
  },
  methods: {
    ...mapActions("bovine", ["getAllBovine"]),
    ...mapActions("bovine", ["deleteBovine"]),
    ...mapActions("bovine", ["borrarDatos"]),

    
  },
};
</script>
<style>
.textLeft {
  text-align: left !important;
}
.marginButton {
  margin-top: 0px !important;
}
.marginSeccion {
  margin-bottom: 8px;
}
.borderDiv {
  border: solid;
  padding-left: 0px;
  padding-right: 0px;
}


</style>