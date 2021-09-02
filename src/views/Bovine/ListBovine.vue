<template>
  <div class="d-flex align-items-center full-width">
    <div class="col-12">
      <div class="card">
        <div class="card-header bg-dark text-white text-center">
          <h3>Listado Bovinos</h3>
        </div>
        <div class="card-body">
          <div class="col-10 offset-1">
            <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
              <button class="btn btn-info text-white" type="button"
                      v-on:click="this.$router.push({name: 'AddBovine'})">
                + Agregar Nuevo
              </button>
            </div>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-12 col-md-6 col-lg-4">
                  <input
                      v-model.trim="search.tag"
                      class="form-control "
                      maxlength="10"
                      placeholder="Caravana"
                      type="text"
                  >
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <select id="sexo" v-model="search.genre" class="form-select invalid-arrow">
                    <option selected value="">Sexo</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <input
                      v-model.trim="search.description"
                      class="form-control"
                      placeholder="Descripcion"
                      type="text"
                  >
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2 mb-2">
                  <button class="btn btn-dark text-white"
                          type="button"
                          v-on:click="this.clearBovineData()">
                    Reestablecer
                  </button>
                  <button class="btn btn-info text-white"
                          type="button"
                          v-on:click="this.searchBovines()">
                    Buscar
                  </button>
                </div>
              </div>
            </form>
            <div class="col-12 table-responsive">
              <table class="table">
                <caption>Mostrando {{this.bovines.length}} de {{this.headers.totalElements}} bovinos</caption>
                <thead>
                <tr v-if="headers.totalElements !== 0">
                  <th scope="col">Caravana</th>
                  <th scope="col">Fecha de Caravaneo</th>
                  <th v-if="!this.isMobile" scope="col">Genero</th>
                  <th v-if="!this.isMobile" scope="col">Descripcion</th>
                  <th class="text-end" scope="col">Acciones</th>
                </tr>
                <tr v-else>
                  <th scope="col">No hay resultados disponibles</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(bovine, index) in bovines" :key="bovine.tag">
                  <td>{{ bovine.tag }}</td>
                  <td>{{ moment(bovine.taggingDate).format('DD/MM/YYYY') }}</td>
                  <td v-if="!this.isMobile">{{ bovine.genre }}</td>
                  <td v-if="!this.isMobile">{{ bovine.description }}</td>
                  <td class="text-end">
                    <font-awesome-icon
                        class="me-2"
                        icon="edit"
                        v-on:click="this.$router.push('/bovinos/formulario/?tag='+bovine.tag)">
                    </font-awesome-icon>
                    <font-awesome-icon
                        icon="trash"
                        v-on:click="formDeleteBovine(bovine.tag, index)">
                    </font-awesome-icon>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-if="headers.totalPages > 1" class="d-flex justify-content-center">
              <div aria-label="Large button group" class="btn-group" role="group">
                <button :class="headers.currentPage <= 0? 'disabled':''" class="btn btn-outline-dark" type="button"
                        v-on:click="this.searchBovinePage(this.headers.currentPage-1)">
                  Anterior
                </button>
                <button  v-for="i in headers.totalPages" :key="i" :class="headers.currentPage === i-1? 'btn-dark':'btn-outline-dark'" class="btn botonPages"
                        type="button"
                        v-on:click="this.searchBovinePage(i-1)">
                  {{ i }}
                </button>
                <button :class="headers.currentPage >= headers.totalPages-1? 'disabled':''" class="btn btn-outline-dark"
                        type="button"
                        v-on:click="this.searchBovinePage(this.headers.currentPage+1)">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <confirmation-modal
      :confirmation-message="'¿Confirma que desea eliminar al bovino con caravana ' + this.deleted['tag'] + '?'"
      modal-id="DeleteModal" title="Eliminar"
      @acceptModal="modalDelete()" @rejectModal="this.modal.hide(); this.deleted = {}"></confirmation-modal>
</template>
<script>
import {mapActions} from "vuex";
import moment from 'moment'
import {Modal} from "bootstrap";
import ConfirmationModal from "../../components/ConfirmationModal";

export default {
  name: "ListBovine",
  data() {
    return {
      search: {tag: null, genre: "", description: null},
      bovines: [],
      headers: {totalPages: 0, currentPage: 0, totalElements: 0},
      isMobile: false,
      deleted: {},
      modal: null,
    };
  },
  components: {
    ConfirmationModal
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true});
    }
  },
  mounted() {
    this.modal = new Modal(document.getElementById('DeleteModal'));
    this.searchBovines();
    this.onResize();
    window.addEventListener('resize', this.onResize, {passive: true});
  },
  methods: {
    ...mapActions("bovine", ["listBovines", "deleteBovine", "clearBovineData"]),
    onResize() {
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
      this.bovines = [];
      this.search = {tag: null, genre: "", description: null};
    },
    async formDeleteBovine(tag, index) {
      this.deleted = {
        tag: tag,
        index: index
      };
      this.modal.show()
    },
    async modalDelete() {
      this.modal.hide()
      this.deleteBovine(this.deleted["tag"]).then(
          () => {
            this.bovines.splice(this.deleted["index"], 1);
          }
      );
    },
    async searchBovines(page = 0, size = 10) {
      this.bovines = null;
      this.listBovines({page: page, size: size, search: this.search}).then(
          (response) => {
            this.bovines = response.data;
            console.log(response);
            this.headers.totalPages = parseInt(response.headers["total-pages"]);
            this.headers.currentPage = parseInt(response.headers["current-page"]);
            this.headers.totalElements = parseInt(response.headers["total-elements"]);
          }
      )
    }
  },
};
</script>
<style>
.botonPages {
  border-radius: 0 !important;
  border-left-width: 0px !important;
}

.marginEdit {
  margin-right: 15px;
  margin-left: 15px;
}
</style>