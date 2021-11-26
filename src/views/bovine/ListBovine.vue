<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button
        class="btn btn-secondary text-white"
        type="button"
        @click="openBatchModal()"
        :disabled="!hasBovinesSelected"
      >
        Agregar Lote
      </button>
      <button class="btn btn-secondary text-white" type="button" @click="openAddBovineModal(null)">
        + Nuevo Bovino
      </button>
    </div>
    <form @submit.prevent="">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
          <cema-input
            v-model.trim="search.tag"
            component-type="input"
            required
            maxlength="10"
            input-title="Caravana"
            input-id="bovineTag"
            :label="false"
            type="text"
            class="mb-2"
          ></cema-input>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <cema-input
            v-model="search.genre"
            component-type="select"
            required
            input-title="Sexo"
            input-id="bovineGenre"
            :label="false"
            :options="['Macho', 'Hembra']"
            class="mb-2"
          ></cema-input>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <cema-input
            v-model.trim="search.description"
            component-type="input"
            required
            input-title="Descripción"
            input-id="bovineDescription"
            :label="false"
            type="text"
            class="mb-2"
          ></cema-input>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2 mb-2">
          <button class="btn btn-primary text-white" type="button" @click="this.clearSearchBovineData()">
            Restablecer
          </button>
          <button class="btn btn-secondary text-white" type="button" @click="this.searchBovines()">Buscar</button>
        </div>
      </div>
    </form>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>
          Mostrando
          {{
            this.bovineLength
          }}
          de
          {{
            this.headers.totalElements
          }}
          bovinos
        </caption>
        <thead>
          <tr v-if="headers.totalElements !== 0">
            <th scope="col">Caravana</th>
            <th scope="col">Fecha de caravaneo</th>
            <th v-if="!this.isMobile" scope="col">Sexo</th>
            <th v-if="!this.isMobile" scope="col">Descripción</th>
            <th v-if="!this.isMobile" scope="col">Categoria</th>
            <th v-if="!this.isMobile" scope="col">Estado</th>
            <th v-if="!this.isMobile" scope="col">Lotes</th>
            <th class="text-end" scope="col">Acciones</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron resultados para las condiciones de búsquedas ingresadas.</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(bovine, index) in bovines"
            :key="bovine.tag"
            :class="this.tagBovinesSelected.has(bovine.tag) ? 'table-active' : ''"
            :style="
              this.bovineCuigSelected && this.bovineCuigSelected !== bovine.establishmentCuig ? 'color: grey' : ''
            "
            @click="toggleBovineSelected(bovine.tag, bovine.establishmentCuig)"
          >
            <td>{{ bovine.establishmentCuig }}-{{ bovine.tag }}</td>
            <td>{{ this.javaDateToMomentDate(bovine.taggingDate) }}</td>
            <td v-if="!this.isMobile">{{ bovine.genre }}</td>
            <td v-if="!this.isMobile">{{ bovine.description }}</td>
            <td v-if="!this.isMobile">{{ bovine.category }}</td>
            <td v-if="!this.isMobile">{{ bovine.status }}</td>
            <td v-if="!this.isMobile" class="overflow-auto w-25">
              <batch-badge
                v-for="batch in bovine.batchNames.slice(0, 1)"
                :badge-content="batch"
                :condition="!hasBovinesSelected"
                @click.stop="removeBovineFromBatch(bovine, batch)"
                :key="batch"
              ></batch-badge>
              <template v-if="showingExtraData === bovine.tag">
                <batch-badge
                  v-for="batch in bovine.batchNames.slice(1)"
                  :badge-content="batch"
                  :condition="true"
                  @click.stop="removeBovineFromBatch(bovine, batch)"
                  :key="batch"
                ></batch-badge>
              </template>
              <batch-badge
                v-if="(bovine.batchNames.length > 1) & (showingExtraData !== bovine.tag)"
                badge-content="..."
                :badge-type="0"
                @click.stop="showMoreBatches(bovine)"
                :condition="!hasBovinesSelected"
              ></batch-badge>
            </td>
            <td class="text-end">
              <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddBovineModal(bovine)"> </font-awesome-icon>
              <font-awesome-icon
                icon="trash"
                @click.stop="formDeleteBovine(bovine.tag, index, bovine.establishmentCuig)"
              >
              </font-awesome-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="headers.totalPages > 1" class="d-flex justify-content-center">
      <div aria-label="Large button group" class="btn-group" role="group">
        <button
          :class="headers.currentPage <= 0 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          @click="this.searchBovinePage(this.headers.currentPage - 1)"
        >
          Anterior
        </button>
        <button
          v-for="i in headers.totalPages"
          :key="i"
          :class="headers.currentPage === i - 1 ? 'btn-primary' : 'btn-outline-primary'"
          class="btn"
          type="button"
          @click="this.searchBovinePage(i - 1)"
        >
          {{ i }}
        </button>
        <button
          :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          @click="this.searchBovinePage(this.headers.currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="
      '¿Confirma que desea eliminar al bovino con caravana ' + this.deleted['cuig'] + '-' + this.deleted['tag'] + '?'
    "
    modal-id="DeleteModal"
    title="Eliminar"
    @acceptModal="
      modalDelete();
      this.deleteModal.hide();
    "
    @rejectModal="
      this.deleteModal.hide();
      this.deleted = {};
    "
  ></confirmation-modal>
  <bovine-modal modalId="addBovineModal" @deleteModal="deleteBovineForm"></bovine-modal>
  <batch-modal
    modalId="addBatchModal"
    @addBovinesToBatch="addBovinesToBatch"
    @cleanSelectedBovines="
      tagBovinesSelected = new Set();
      bovineCuigSelected = null;
    "
  ></batch-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import CemaInput from '../../components/form/CemaInput';
import BovineModal from '../../components/bovine/BovineModal';
import BatchModal from '../../components/bovine/BatchModal';
import BatchBadge from '../../components/bovine/BatchBadge';

export default {
  name: 'ListBovine',
  data() {
    return {
      search: { tag: null, genre: '', description: null },
      bovines: [],
      tagBovinesSelected: new Set(),
      bovineCuigSelected: null,
      bovineLength: 0,
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      isMobile: false,
      deleted: {},
      deleteModal: null,
      addBovineModal: null,
      showingExtraData: null,
      batchModal: null,
      timeout: false,
      delay: 250,
    };
  },
  components: {
    BatchBadge,
    BovineModal,
    BatchModal,
    ConfirmationModal,
    CemaInput,
  },
  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeTimeOut);
    }
  },
  mounted() {
    this.addBovineModal = new Modal(document.getElementById('addBovineModal'));
    this.batchModal = new Modal(document.getElementById('addBatchModal'));
    this.deleteModal = new Modal(document.getElementById('DeleteModal'));
    this.isMobile = screen.width <= 760;
    this.searchBovinePage(this.headers.currentPage);
    window.addEventListener('resize', this.resizeTimeOut);
  },
  computed: {
    hasBovinesSelected() {
      return this.tagBovinesSelected.size !== 0;
    },
  },
  methods: {
    ...mapActions('bovine', [
      'listBovines',
      'deleteBovine',
      'clearBovineData',
      'setupEditBovine',
      'setupListBovineSelected',
      'removeBovinesFromBatch',
    ]),
    toggleBovineSelected(tag, cuig) {
      this.showingExtraData = null;
      if (!this.bovineCuigSelected) {
        this.bovineCuigSelected = cuig;
      }
      if (this.bovineCuigSelected === cuig) {
        if (this.tagBovinesSelected.has(tag)) {
          this.tagBovinesSelected.delete(tag);
          if (!this.hasBovinesSelected) {
            this.bovineCuigSelected = null;
          }
        } else {
          this.tagBovinesSelected.add(tag);
        }
      }
    },
    resizeTimeOut() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onResize, this.delay);
    },
    onResize(event) {
      let previous = this.isMobile;
      this.isMobile = screen.width <= 760;
      console.log('Mobile:', this.isMobile);
      console.log(this.headers);
      if (previous === this.isMobile) {
        return;
      }
      if (
        !this.isMobile &&
        this.headers.totalPages !== this.headers.currentPage &&
        this.headers.totalElements - this.bovineLength !== 0
      ) {
        this.headers.currentPage = Math.floor(this.headers.currentPage / 2);
        this.searchBovinePage(this.headers.currentPage);
      } else if (this.isMobile) {
        let oldTotalPages = this.headers.totalPages - 1;
        this.headers.totalPages = Math.floor(this.headers.totalElements / 5);
        this.headers.currentPage =
          this.headers.currentPage === oldTotalPages ? this.headers.totalPages - 1 : this.headers.currentPage;
        if (this.bovineLength > 5) {
          this.bovines.splice(5);
          this.bovineLength = this.bovines != null ? this.bovines.length : 0;
        }
      }
    },
    clearSearchBovineData() {
      this.search = { tag: null, genre: '', description: null };
      this.searchBovinePage(0);
    },
    setIndexForTag(tag, index, cuig) {
      this.deleted = {
        cuig: cuig,
        tag: tag,
        index: index,
      };
    },
    deleteBovineForm(tag) {
      let index = null;
      let cuig = null;
      for (let i = 0; i < this.bovines.length; i++) {
        if (this.bovines[i].tag === tag) {
          index = i;
          cuig = this.bovines[i].establishmentCuig;
          console.log(`Searched tag: ${tag}, found at ${index}`);
          break;
        }
      }
      if (index === null) {
        console.error(`Searched tag: ${tag}, was not found`);
        return;
      }
      this.setIndexForTag(tag, index, cuig);
      this.modalDelete();
    },
    formDeleteBovine(tag, index, cuig) {
      this.setIndexForTag(tag, index, cuig);
      this.deleteModal.show();
    },
    openAddBovineModal(bovine) {
      this.clearBovineData();
      if (bovine) {
        bovine.taggingDate = this.javaDateToMomentDate(bovine.taggingDate, 'YYYY-MM-DD');
        this.setupEditBovine(bovine);
      }
      this.addBovineModal.show();
    },
    openBatchModal() {
      console.log(this.tagBovinesSelected, 'size: ' + this.tagBovinesSelected.size, 'cuig: ' + this.bovineCuigSelected);
      if (this.hasBovinesSelected) {
        this.setupListBovineSelected({ proxyListTag: this.tagBovinesSelected, cuig: this.bovineCuigSelected });
        this.batchModal.show();
      }
    },
    addBovinesToBatch(batchName) {
      console.log('Adding', batchName, 'to bovine:');
      for (let i = 0; i < this.bovines.length; i++) {
        console.log(this.bovines[i]);
        if (this.tagBovinesSelected.has(this.bovines[i].tag)) {
          console.log('added');
          this.bovines[i].batchNames.push(batchName);
        }
      }
    },
    async searchBovinePage(page) {
      console.log(`You are in page ${this.headers.currentPage}, and requesting ${page} page`);
      await this.searchBovines(page, this.isMobile ? 5 : 10);
    },
    async modalDelete() {
      console.log(`Deleting bovine ${this.deleted['cuig']}-${this.deleted['tag']}`);
      this.deleteBovine(this.deleted).then(() => {
        this.bovines.splice(this.deleted['index'], 1);
      });
    },
    async searchBovines(page = 0, size = 10) {
      this.bovines = null;
      this.listBovines({ page: page, size: size, search: this.search }).then((response) => {
        this.bovines = response.data;
        console.log(response);
        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);
        this.bovineLength = this.bovines != null ? this.bovines.length : 0;
      });
    },
    async removeBovineFromBatch(bovine, batch) {
      let tag = bovine.tag;
      let cuig = bovine.establishmentCuig;
      if (this.hasBovinesSelected) {
        this.toggleBovineSelected(tag, cuig);
      } else {
        this.removeBovinesFromBatch({ batch: batch, listBovinesSelected: [tag], cuig: cuig }).then((response) => {
          console.log(`El bovino ${tag} fue eliminado del lote ${response.data.batchName} correctamente.`);
          bovine.batchNames.splice(bovine.batchNames.indexOf(batch), 1);
        });
      }
    },
    showMoreBatches(bovine) {
      let tag = bovine.tag;
      let cuig = bovine.establishmentCuig;
      if (this.hasBovinesSelected) {
        this.toggleBovineSelected(tag, cuig);
      } else {
        this.showingExtraData = tag;
      }
    },
  },
};
</script>
<style></style>
