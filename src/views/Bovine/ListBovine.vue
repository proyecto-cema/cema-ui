<template>
  <div class="row text-center"  >
    <div class="col-12">
      <form @submit.prevent="procesarFormulario" style="border-radius: 10px;margin-top:50px; background: #ffffff;" class="borderDiv">
        <div>
          <div class="header">
            <h3 style="color:white">Listado Bovinos</h3>
          </div>
          <div class="col-10 offset-1">
            <div class="row">
              <div>
                <button type="button" class="btn btn-info text-white button-margin" style="float: right;" v-on:click="this.$router.push('/bovinos/formulario/')">
                  + Agregar Nuevo    
                </button>  
              </div>
              <div class="col-12 col-md-6 col-lg-4 marginSeccion">
                <input
                  v-model.trim="search.tag"
                  class="form-control marginButton"
                  maxlength="10"
                  placeholder="Caravana"
                  required type="text"
                >
              </div>
              <div class="col-12 col-md-6 col-lg-4  marginSeccion">
                <select id="sexo" v-model="search.genre" class="form-control invalid-arrow marginButton">
                  <option selected="selected" value="">Sexo (Seleccionar)</option>
                  <option selected value="Macho">Macho</option>
                  <option selected value="Hembra">Hembra</option>
                </select>
              </div>
              <div class="col-12 col-md-6 col-lg-4  marginSeccion">
                <input 
                  type="text"
                  placeholder="Descripcion"
                  class="form-control marginButton"
                  v-model.trim="search.description"
                  maxlength="10" required
                >  
              </div>
              <div class="row" style="padding-right: 0px;"> 
                <div class="d-flex justify-content-end" style="padding-right: 0px;">
                  <button class="btn btn-dark text-white button-margin"
                    v-on:click="this.clearBovineData()"
                    style="float: left; margin-right: 15px;" type="button">
                    Reestablecer
                  </button>
                  <button class="btn btn-info text-white button-margin"
                    v-on:click="this.searchBovines()"
                    style="float: left;" type="button">
                    Buscar
                  </button>
                </div>
              </div>  
             <div class="col-12 table-responsive">
                <table class="table">
                  <thead>
                    <tr v-if="headers.totalElements !== 0">
                      <th scope="col">Caravana</th>
                      <th scope="col" v-if="!this.isMobile">Descripcion</th>
                      <th scope="col" v-if="!this.isMobile">Genero</th>
                      <th scope="col">Fecha de Caravaneo</th>
                      <th scope="col">Acciones</th>
                    </tr>
                    <tr v-else>
                      <th scope="col">No hay resultados disponibles</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(bovine, index) in bovines" :key="bovine.tag">
                      <td>{{ bovine.tag }}</td>
                      <td v-if="!this.isMobile">{{ bovine.description }}</td>
                      <td v-if="!this.isMobile">{{ bovine.genre }}</td>
                      <td>{{moment(bovine.taggingDate).format('DD/MM/YYYY')}}</td>
                      <td>
                        <font-awesome-icon
                            class="marginEdit"
                            v-on:click="this.$router.push('/bovinos/formulario/?tag='+bovine.tag)"
                            icon="edit">
                        </font-awesome-icon>
                        <font-awesome-icon
                            v-on:click="formDeleteBovine(bovine.tag, index)"
                            icon="trash">
                        </font-awesome-icon>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
                <div class="col-12" style="margin-bottom: 15px;" v-if="headers.totalPages > 1">
                  <div class="btn-group" role="group" aria-label="Large button group" >
                    <button type="button" class="btn btn-outline-dark" :class="headers.currentPage <= 0? 'disabled':''"
                            v-on:click="this.searchBovinePage(this.headers.currentPage-1)">
                      Anterior
                    </button>
                    <div v-for="i in headers.totalPages" :key="i">
                      <button type="button" class="btn botonPages"
                              :class="headers.currentPage === i-1? 'btn-dark':'btn-outline-dark'"
                              v-on:click="this.searchBovinePage(i-1)">
                        {{i}}
                      </button>
                    </div>
                  <button type="button" class="btn btn-outline-dark"
                          :class="headers.currentPage >= headers.totalPages-1? 'disabled':''"
                          v-on:click="this.searchBovinePage(this.headers.currentPage+1)">
                    Siguiente
                  </button>
                </div>
              </div> 
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import {mapActions} from "vuex";
import moment from 'moment' 
export default {
  name: "ListBovine",
  data() {
    return {
      search: {tag:null, genre:"", description:null},
      bovines: [],
      headers: {totalPages:0 ,currentPage:0 ,totalElements:0},
      isMobile: false
    };
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted() {
    this.searchBovines();
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  computed: {
  },
  methods: {
    ...mapActions("bovine", ["listBovines", "deleteBovine", "clearBovineData"]),
    onResize () {
      this.isMobile = screen.width <= 760
      this.searchBovinePage(this.headers.currentPage);
    },
    moment() {
      return moment();
    },
    async searchBovinePage(page) {
      console.log(`You are in page ${this.headers.currentPage}, and requesting ${page} page`);
      await this.searchBovines(page, this.isMobile ? 5 : 10)
    },
    async clearBovineData() {
      this.bovines=[];
      this.search= {tag:null, genre:"", description:null};
    },
    async formDeleteBovine(tag, index) {
      this.deleteBovine(tag).then(
          () => {
            this.bovines.splice(index, 1);
          }
      );
    },
    async searchBovines(page=0, size=10) {
      this.bovines=null;
      this.listBovines({page:page, size:size, search:this.search}).then(
          (response) => {
            this.bovines = response.data;
            console.log(response);
            this.headers.totalPages=parseInt(response.headers["total-pages"]);
            this.headers.currentPage=parseInt(response.headers["current-page"]);
            this.headers.totalElements=parseInt(response.headers["total-elements"]);
          }
      )
    }
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
.botonPages{
  border-radius: 0 !important;
  border-left-width: 0px !important;
}
.marginEdit{
  margin-right: 15px;
  margin-left: 15px;
}
.header{
  background-color:black;
  padding-bottom: 1px;margin-bottom: 5px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
</style>