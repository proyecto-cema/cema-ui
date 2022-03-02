<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button" @click="openAddSupplyModal(null, null)">
        + Nuevo Insumo
      </button>
    </div>
    <form @submit.prevent="">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
          <cema-input
            v-model.trim="search.name"
            component-type="input"
            maxlength="10"
            input-title="Nombre"
            input-id="supplyNameSearch"
            :label="false"
            type="text"
            class="mb-2"
          ></cema-input>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <cema-input
            v-model="search.categoryName"
            component-type="select"
            input-title="Categoría"
            input-id="supplyCategoryNameSearch"
            :options="categoriesName"
            :label="false"
            optionKey="name"
            v-slot="{ option }"
          >
            {{ option.name }}
          </cema-input>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <cema-input
            v-model.trim="search.units"
            component-type="input"
            maxlength="10"
            input-title="Unidad"
            input-id="supplyUnitSearch"
            :label="false"
            type="text"
            class="mb-2"
          ></cema-input>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2 mb-2">
          <button class="btn btn-primary text-white" type="button" @click="this.clearSearchSupplyData()">
            Restablecer
          </button>
          <button class="btn btn-secondary text-white" type="button" @click="this.searchSupplies()">Buscar</button>
        </div>
      </div>
    </form>
    <div class="mt-2">
      <h3>Listado de Insumos</h3>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>
          {{
            `Mostrando ${suppliesLength} de ${this.headers.totalElements} insumos`
          }}
        </caption>
        <thead>
          <tr v-if="suppliesLength !== 0">
            <th scope="col">Nombre</th>
            <th scope="col">Categoria</th>
            <th scope="col">Precio</th>
            <th scope="col">Unidad</th>
            <th scope="col">Disponible</th>
            <th class="text-end" scope="col">Acciones</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron resultados.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(supply, index) in supplies" :key="supply.name">
            <td>{{ supply.name }}</td>
            <td>{{ supply.categoryName }}</td>
            <td>{{ supply.price }}</td>
            <td>{{ supply.units }}</td>
            <td>{{ supply.available }}</td>
            <td class="text-end">
              <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddSupplyModal(index, supply)">
              </font-awesome-icon>
              <font-awesome-icon icon="trash" @click.stop="formDeleteSupply(index, supply.name)"> </font-awesome-icon>
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
          @click="this.searchSupplyPage(this.headers.currentPage - 1)"
        >
          Anterior
        </button>
        <button
          v-for="i in headers.totalPages"
          :key="i"
          :class="headers.currentPage === i - 1 ? 'btn-primary' : 'btn-outline-primary'"
          class="btn"
          type="button"
          @click="this.searchSupplyPage(i - 1)"
        >
          {{ i }}
        </button>
        <button
          :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          @click="this.searchSupplyPage(this.headers.currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="'¿Confirma que desea eliminar el insumo ' + deleted['name'] + '?'"
    modal-id="deleteModal"
    title="Eliminar"
    @acceptModal="
      modalDelete();
      deleteModal.hide();
    "
    @rejectModal="
      deleteModal.hide();
      deleted = {};
    "
  ></confirmation-modal>
  <supply-modal
    modal-id="addSupplyModal"
    :categories-name="categoriesName"
    @deleteModal="deleteSupplyForm"
    @createdNew="addSupplyToList"
  ></supply-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import SupplyModal from '../../components/administration/SupplyModal';
import CemaInput from '../../components/form/CemaInput';

export default {
  name: 'ListSupplies',
  data() {
    return {
      supplies: [],
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      deleted: {},
      deleteModal: null,
      addSupplyModal: null,
      search: { categoryName: '' },
      categoriesName: [],
      timeout: false,
      delay: 250,
    };
  },
  components: { ConfirmationModal, SupplyModal, CemaInput },
  mounted() {
    console.log('here');
    this.searchCategoriesName();
    this.addSupplyModal = new Modal(document.getElementById('addSupplyModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
    this.searchSupplies();
  },
  computed: {
    suppliesLength() {
      return this.supplies != null ? this.supplies.length : 0;
    },
  },
  methods: {
    ...mapActions('supply', ['listCategories', 'listSupplies', 'setupEditSupply', 'deleteSupply', 'makeDefaultSupply']),
    ...mapActions('supplyOperation', ['getSupplyOperationAvailableForName']),
    ...mapActions(['showSuccess']),
    setIndexForName(index, name) {
      this.deleted = {
        name: name,
        index: index,
      };
    },
    formDeleteSupply(index, name) {
      this.setIndexForName(index, name);
      this.deleteModal.show();
    },
    clearSearchSupplyData() {
      this.search = { categoryName: '' };
      this.searchSupplies(0);
    },
    openAddSupplyModal(index, supply) {
      if (supply) {
        this.setIndexForName(index, supply.name);
        this.setupEditSupply(supply);
      }
      this.addSupplyModal.show();
    },
    deleteSupplyForm(name) {
      if (!this.deleted) {
        this.setIndexForName(this.supplies.length, name);
      }
      this.modalDelete();
    },
    addSupplyToList({ supply, edit }) {
      console.log(supply, edit);
      let helperDeleted = { ...this.deleted };
      if (edit) {
        this.supplies.splice(helperDeleted.index, 1);
        this.deleted = {};
      }
      if (this.supplies.length % 10 === 0) {
        this.headers.currentPage += this.headers.totalPages;
        this.headers.totalPages += 1;
        this.headers.totalElements += 1;
        this.supplies = [];
      }
      this.supplies.push(supply);
    },
    async modalDelete() {
      let helperDeleted = { ...this.deleted };
      let toDelete = this.supplies[helperDeleted.index];
      console.log(`Deleting supply ${helperDeleted.name}`);
      this.deleteSupply(toDelete).then(() => {
        this.supplies.splice(helperDeleted.index, 1);
        this.showSuccess(`El insumo ${helperDeleted.name} se eliminó correctamente`);
        let index_to_search = this.headers.currentPage;
        if (helperDeleted.index % 11 === 0) {
          index_to_search -= 1;
        }
        if (index_to_search < 0) {
          index_to_search = 0;
        }
        this.searchSupplies(index_to_search);
        this.deleted = {};
      });
    },
    async searchSupplyPage(page) {
      console.log(`You are in page ${this.headers.currentPage}, and requesting ${page} page`);
      await this.searchSupplies(page, 10);
    },
    async searchSupplies(page = 0, size = 10) {
      this.supplies = null;
      let search = { ...this.search };
      this.listSupplies({ page: page, size: size, search: search }).then((response) => {
        this.supplies = response.data;

        console.log(response);

        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);
        this.searchAvailable();
      });
    },
    async searchAvailable() {
      for (let i = 0; this.supplies.length > i; i++) {
        this.getSupplyOperationAvailableForName(this.supplies[i].name).then((response) => {
          this.supplies[i].available = response.data.available;
        });
      }
    },
    async searchCategoriesName() {
      console.log('here');
      this.listCategories().then((response) => {
        this.categoriesName = response.data;
        console.log(response);
        console.log('Categorias:', this.categoriesName);
      });
    },
  },
};
</script>
<style></style>
