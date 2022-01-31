<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button" @click="openAddSupplyModal(null, null)">
        + Nuevo Insumo
      </button>
    </div>
    <div class="mt-2">
      <h3>Listado de Insumos</h3>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>
          {{
            `Mostrando ${suppliesLength} de ${suppliesLength} insumos`
          }}
        </caption>
        <thead>
          <tr v-if="suppliesLength !== 0">
            <th scope="col">Nombre</th>
            <th scope="col">Categoria</th>
            <th scope="col">Precio</th>
            <th scope="col">Unidad</th>
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
            <td class="text-end">
              <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddSupplyModal(index, supply)">
              </font-awesome-icon>
              <font-awesome-icon icon="trash" @click.stop="formDeleteSupply(index, supply.name)"> </font-awesome-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center">
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
  <supply-modal modalId="addSupplyModal" @deleteModal="deleteSupplyForm" @createdNew="addSupplyToList"></supply-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import SupplyModal from '../../components/administration/SupplyModal';

export default {
  name: 'ListSupplies',
  data() {
    return {
      supplies: [],
      suppliesLength: 0,
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      deleted: {},
      deleteModal: null,
      addSupplyModal: null,
      timeout: false,
      delay: 250,
    };
  },
  components: { ConfirmationModal, SupplyModal },
  mounted() {
    this.addSupplyModal = new Modal(document.getElementById('addSupplyModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
    this.searchSupplies();
  },
  methods: {
    ...mapActions('supply', ['listSupplies', 'setupEditSupply', 'deleteSupply', 'makeDefaultSupply']),
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
      this.supplies.push(supply);
    },
    changeDefaultSupply(index) {
      let supply = this.supplies[index];
      if (supply.isDefault) {
        console.log('Already default');
        return;
      }
      this.makeDefaultSupply(supply).then(() => {
        this.searchSupplies();
      });
    },
    async modalDelete() {
      let helperDeleted = { ...this.deleted };
      let toDelete = this.supplies[helperDeleted.index];
      console.log(`Deleting supply ${helperDeleted.name}`);
      this.deleteSupply(toDelete).then(() => {
        this.supplies.splice(helperDeleted.index, 1);
        this.showSuccess(`El insumo ${helperDeleted.name} se eliminó correctamente`);
        this.searchSupplies();
        this.deleted = {};
      });
    },
    async searchSuppliesPage(page) {
      await this.searchSupplies(page, 10);
    },
    async searchSupplies(page = 0, size = 10) {
      this.supplies = null;
      this.listSupplies({ page: page, size: size }).then((response) => {
        this.supplies = response.data;

        console.log(response);

        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);
        this.suppliesLength = this.supplies != null ? this.supplies.length : 0;
      });
    },
  },
};
</script>
<style></style>
