<template>
  <div class="text-center">
    <br />
    <h3>Listado Operaciones de Insumos</h3>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button" v-on:click="openAddSupplyOperationModal(null)">
        + Nueva Operación de Insumos
      </button>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <thead>
          <tr v-if="supplliesOperationsLength !== 0">
            <th scope="col">Fecha Operación</th>
            <th scope="col">Tipo Operación</th>
            <th scope="col">Insumo</th>
            <th scope="col">Cantidad</th>
            <th class="text-end" scope="col">Acciones</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron resultados.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplyOperation in supplliesOperations" :key="supplyOperation.id">
            <td>{{ this.javaDateToMomentDate(supplyOperation.transactionDate) }}</td>
            <td>{{ supplyOperation.operationType }}</td>
            <td>{{ supplyOperation.supplyName }}</td>
            <td>{{ supplyOperation.amount }}</td>
            <td class="text-end">
              <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddSupplyOperationModal(supplyOperation)">
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
          v-on:click="this.searchSupplyOperations(this.headers.currentPage - 1)"
        >
          Anterior
        </button>
        <button
          v-for="i in headers.totalPages"
          :key="i"
          :class="headers.currentPage === i - 1 ? 'btn-primary' : 'btn-outline-primary'"
          class="btn"
          type="button"
          v-on:click="this.searchSupplyOperations(i - 1)"
        >
          {{ i }}
        </button>
        <button
          :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          v-on:click="this.searchSupplyOperations(this.headers.currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
  <supply-operation-modal
    modalId="addSupplyOperationModal"
    @modalSuccess="closeSupplyOperationModal"
  ></supply-operation-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import supplyOperationModal from '../../components/operation/SupplyOperationModal';

export default {
  name: 'ListSupplyOperations',
  data() {
    return {
      supplliesOperations: [],
      supplliesOperationsLength: 0,
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      addOperationModal: null,
    };
  },
  components: { supplyOperationModal },
  mounted() {
    this.searchSupplyOperations(0, 10);

    this.addSupplyOperationModal = new Modal(document.getElementById('addSupplyOperationModal'));
  },
  methods: {
    ...mapActions('supplyOperation', [
      'listSupplyOperations',
      'setupEditSupplyOperation',
      'clearSupplyOperationData',
      'getSupplyOperationAvailableForName',
      'setupEditAvailableSupply',
      'setupEditPrice',
      'setupEditTotalOperation',
    ]),
    ...mapActions('supply', ['getSupply']),
    ...mapActions(['showSuccess']),
    setIndexForName(index, name) {
      this.deleted = {
        name: name,
        index: index,
      };
    },
    closeSupplyOperationModal(supplyOperation) {
      this.addSupplyOperationToList(supplyOperation);
      this.addSupplyOperationModal.hide();
      this.clearSupplyOperationData();
    },
    openAddSupplyOperationModal(SupplyOperation) {
      let price = 0;
      this.clearSupplyOperationData();
      if (SupplyOperation) {
        console.log(SupplyOperation);
        this.setupEditSupplyOperation(SupplyOperation);
        this.getSupply(SupplyOperation.supplyName).then((response) => {
          this.price = response.data.price;
          this.setupEditPrice(response.data.price);
          this.getSupplyOperationAvailableForName(SupplyOperation.supplyName).then((response) => {
            this.setupEditAvailableSupply(response.data.available);
            console.log('Disponiblilidad: ' + response);
            this.setupEditTotalOperation(SupplyOperation.amount * this.price);
          });
        });
      }

      this.addSupplyOperationModal.show();
    },

    addSupplyOperationToList({ supplyOperation, edit }) {
      console.log(supplyOperation, edit);
      if (!edit && this.supplyOperationsLength < 10) {
        this.supplyOperations.push(supplyOperation);
      }
    },

    async searchSupplyOperations(page = 0, size = 10) {
      this.supplliesOperations = null;

      this.listSupplyOperations({ page: page, size: size }).then((response) => {
        this.supplliesOperations = response.data;
        console.log(response);
        console.log('SupplyOperaciones ' + this.supplliesOperations);
        console.log('SupplyOperaciones length ' + this.supplliesOperations.length);
        for (var i = 0; i < this.supplliesOperations.length; i++) {
          if (this.supplliesOperations[i].operationType == 'buy') {
            this.supplliesOperations[i].operationType = 'Compra';
          } else {
            if (this.supplliesOperations[i].operationType == 'use') {
              this.supplliesOperations[i].operationType = 'Consumo';
            } else {
              this.supplliesOperations[i].operationType = 'Perdida';
            }
          }
        }
        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);

        this.supplliesOperationsLength = this.supplliesOperations != null ? this.supplliesOperations.length : 0;
      });
    },
  },
};
</script>
<style></style>
