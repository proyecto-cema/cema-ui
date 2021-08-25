<template>
  <form @submit.prevent="procesarFormulario">
    <div style="background-color:black;padding-bottom: 1px;margin-bottom: 5px;">
      <h3 style="color:white">Listado Bovinos</h3>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 marginSeccion">
        <div class="textLeft"><label>Caravana</label></div>
        <input
            v-model.trim="search.tag"
            class="form-control marginButton"
            maxlength="10"
            placeholder="Tag"
            required type="text"
        >
      </div>
      <div class="col-12 col-md-6 marginSeccion">
        <div class="textLeft"><label>Fecha de caravaneo</label></div>
        <input
            v-model.trim="search.taggingDate"
            class="form-control marginButton"
            placeholder="Fecha"
            type="date"
        >
      </div>
      <div class="col-12 col-md-6 marginSeccion">
        <div class="textLeft"><label>Sexo</label></div>
        <select id="sexo" v-model="search.genre" class="form-control invalid-arrow marginButton">
          <option selected="selected" value="">Seleccionar</option>
          <option selected value="Masculino">Masculino</option>
          <option selected value="Femenino">Femenino</option>
        </select>
      </div>
      <div class="col-12 col-md-6" style="margin-top: 15px;">
        <button class="btn btn-info text-white button-margin" data-bs-target="#SabeModal" data-bs-toggle="modal"
                style="float: left;" type="button">
          Buscar
        </button>
        <button class="btn btn-info text-white button-margin" data-bs-target="#SabeModal" data-bs-toggle="modal"
                style="float: right;" type="button">
          Agregar Nuevo
        </button>
      </div>
      <div class="col-12">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">TAG</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Genero</th>
            <th scope="col">Fecha</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="bovine in bovines">
              <td v-for="attr in bovine">{{ attr }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </form>
</template>
<script>
import {mapActions} from "vuex";

export default {
  name: "ListBovine",
  data() {
    return {
      search: {tag:null,genre:null,taggingDate:null},
      fields: ['first_name', 'last_name', 'age'],
      bovines: [],
    };
  },
  mounted() {
    this.listBovines(0, 10).then(
        (response) => {
          this.bovines = response.data;
          console.log(response);
        }
    )
  },
  computed: {
  },
  methods: {
    ...mapActions("bovine", ["listBovines", "deleteBovine", "clearBovineData"]),
  },
};
</script>
<style>
.textLeft {
  text-align: left !important;
}

.marginButton {
  margin-top: 0 !important;
}

.marginSeccion {
  margin-bottom: 8px;
}


</style>