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
          <tr v-if="suppliesOperationsLength !== 0">
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
          <tr v-for="supplyOperation in suppliesOperations" :key="supplyOperation.id">
            <td>{{ this.javaDateToMomentDate(supplyOperation.transactionDate) }}</td>
            <td>{{ operationsTypes[supplyOperation.operationType] }}</td>
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
    <list-pagination @call-change-page="this.searchSupplyOperations" :headers="this.headers"></list-pagination>
  </div>
  <supply-operation-modal
    modalId="addSupplyOperationModal"
    @modalSuccess="closeSupplyOperationModal"
    @createdNew="addSupplyOperationToList"
  ></supply-operation-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import supplyOperationModal from '../../components/operation/SupplyOperationModal';
import ListPagination from '../ListPagination';
import { SUPPLY_OPERATION_TYPE } from '../../constants';

export default {
  name: 'ListSupplyOperations',
  data() {
    return {
      suppliesOperations: [],
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      addOperationModal: null,
    };
  },
  components: { ListPagination, supplyOperationModal },
  mounted() {
    this.searchSupplyOperations(0, 10);

    this.addSupplyOperationModal = new Modal(document.getElementById('addSupplyOperationModal'));
  },
  computed: {
    suppliesOperationsLength() {
      return this.suppliesOperations != null ? this.suppliesOperations.length : 0;
    },
    operationsTypes() {
      return SUPPLY_OPERATION_TYPE;
    },
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
    async searchSupplyOperations(page = 0, size = 10) {
      this.suppliesOperations = null;

      this.listSupplyOperations({ page: page, size: size }).then((response) => {
        this.suppliesOperations = response.data;
        console.log(response);
        console.log('SupplyOperations ', this.suppliesOperations);
        this.headers = this.parsePageHeaders(response.headers);
      });
    },
    addSupplyOperationToList({ supplyOperation, edit }) {
      console.log(supplyOperation, edit);
      this.searchSupplyOperations(this.headers.currentPage);
    },
  },
};
</script>
<style></style>
