<template>
  <ul class="nav nav-tabs mt-5" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="animales-tab"
        data-bs-toggle="tab"
        data-bs-target="#animales"
        type="button"
        role="tab"
        aria-controls="animales"
        aria-selected="true"
      >
        Animales
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="insumos-tab"
        data-bs-toggle="tab"
        data-bs-target="#insumos"
        type="button"
        role="tab"
        aria-controls="insumos"
        aria-selected="false"
      >
        Insumos
      </button>
    </li>
  </ul>
  <div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="animales" role="tabpanel" aria-labelledby="animales-tab">
      <div class="text-center">
        <br />
        <h3>Listado de Operaciones</h3>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
          <button class="btn btn-secondary text-white" type="button" v-on:click="openAddOperationModal(null)">
            + Nueva Operación
          </button>
        </div>
        <div class="col-12 table-responsive">
          <table class="table">
            <caption>
              Mostrando
              {{
                operationsLength
              }}
              de
              {{
                headers.totalElements
              }}
              Operaciones
            </caption>
            <caption class="justify-content-md-end h3" style="text-align: right">
              Ingreso: ${{
                results.income
              }}
              <br />
              Egreso: ${{
                results.expenses
              }}
              <br />
              <b>Total: ${{ results.total }}</b>
            </caption>
            <thead>
              <tr v-if="operationsLength !== 0">
                <th scope="col">Fecha Operación</th>
                <th scope="col">Comprador</th>
                <th scope="col">Vendedor</th>
                <th scope="col">Descripción</th>
                <th scope="col">Monto</th>
                <th scope="col">Caravana Relacionada</th>
                <th class="text-end" scope="col">Acciones</th>
              </tr>
              <tr v-else>
                <th scope="col">No se encontraron resultados.</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="operation in operations"
                :key="operation.id"
                :class="operation.operationType == 'sell' ? 'sell' : 'buy'"
              >
                <td>{{ this.javaDateToMomentDate(operation.transactionDate) }}</td>
                <td>{{ operation.buyerName }}</td>
                <td>{{ operation.sellerName }}</td>
                <td>{{ operation.description }}</td>
                <td>{{ operation.amount }}</td>
                <td>{{ operation.establishmentCuig }}-{{ operation.bovineTag }}</td>
                <td class="text-end">
                  <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddOperationModal(operation)">
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
              v-on:click="this.searchOperations(this.headers.currentPage - 1)"
            >
              Anterior
            </button>
            <button
              v-for="i in headers.totalPages"
              :key="i"
              :class="headers.currentPage === i - 1 ? 'btn-primary' : 'btn-outline-primary'"
              class="btn"
              type="button"
              v-on:click="this.searchOperations(i - 1)"
            >
              {{ i }}
            </button>
            <button
              :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
              class="btn btn-outline-primary"
              type="button"
              v-on:click="this.searchOperations(this.headers.currentPage + 1)"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-pane fade" id="insumos" role="tabpanel" aria-labelledby="insumos-tab">
      <list-supply-operation></list-supply-operation>
    </div>
  </div>
  <operation-modal modalId="addOperationModal" @modalSuccess="closeOperationModal"></operation-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import OperationModal from '../../components/operation/OperationModal';
import ListSupplyOperation from '../../components/operation/ListSupplyOperations';

export default {
  name: 'ListOperations',
  data() {
    return {
      operations: [],
      operationsLength: 0,
      results: { income: 0, expenses: 0, total: 0 },
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      addOperationModal: null,
      timeout: false,
      delay: 250,
    };
  },
  components: { OperationModal, ListSupplyOperation },
  mounted() {
    this.searchOperations(0, 10);
    this.obtainMetrics();
    this.addOperationModal = new Modal(document.getElementById('addOperationModal'));
  },
  methods: {
    ...mapActions('operation', ['listOperations', 'setupEditOperation', 'clearOperationData', 'getOperationMetrics']),
    ...mapActions(['showSuccess']),
    setIndexForName(index, name) {
      this.deleted = {
        name: name,
        index: index,
      };
    },
    formDeleteOperation(index, name) {
      this.setIndexForName(index, name);
      this.deleteModal.show();
    },
    closeOperationModal(operation) {
      this.addOperationToList(operation);
      this.addOperationModal.hide();
      this.clearOperationData();
    },
    openAddOperationModal(operation) {
      this.clearOperationData();
      if (operation) {
        console.log(operation);
        if (operation.operationType === 'sell') {
          this.results.income -= operation.amount;
        } else {
          this.results.expenses -= operation.amount;
        }
        this.setupEditOperation(operation);
      }
      this.addOperationModal.show();
    },
    deleteOperationForm(name) {
      let index = null;
      for (let i = 0; i < this.operations.length; i++) {
        if (this.operations[i].name === name) {
          index = i;
          break;
        }
      }
      if (index === null) {
        console.error(`Searched locacion: ${name}, was not found`);
        return;
      }
      this.setIndexForName(index, name);
      this.modalDelete();
    },
    addOperationToList({ operation, edit }) {
      console.log(operation, edit);
      if (edit) {
        if (operation.operationType === 'sell') {
          this.results.income += operation.amount;
        } else {
          this.results.expenses += operation.amount;
        }
      } else if (this.operationsLength < 10) {
        this.operations.push(operation);
      }
    },
    async modalDelete() {
      let helperDeleted = { ...this.deleted };
      console.log(`Deleting operation ${helperDeleted.name}`);
      this.deleteOperation(helperDeleted).then(() => {
        this.operations.splice(helperDeleted.index, 1);
        this.showSuccess(`La Operacion ${helperDeleted.name} se eliminó correctamente`);
        this.deleted = {};
      });
    },
    async searchOperations(page = 0, size = 10) {
      this.operations = null;

      this.listOperations({ page: page, size: size }).then((response) => {
        this.operations = response.data;
        console.log(response);
        console.log('operaciones ' + this.operations);
        console.log('operaciones length ' + this.operations.length);

        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);

        this.operationsLength = this.operations != null ? this.operations.length : 0;
      });
    },
    async obtainMetrics() {
      this.getOperationMetrics().then((data) => {
        console.log(data);
        this.results.income = data.income;
        this.results.expenses = data.spending;
        this.results.total = data.total;
      });
    },
  },
};
</script>
<style>
.sell {
  background-color: #def4bb;
}
.buy {
  background-color: #eeb9b9;
}
</style>
