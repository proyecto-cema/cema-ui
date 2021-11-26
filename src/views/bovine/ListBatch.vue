<template>
  <div class="text-center">
    <div class="col-12 table-responsive">
      <div class="mt-2">
        <h3>Listado Lotes</h3>
      </div>
      <table class="table">
        <thead>
          <tr v-if="batches && batches.length !== 0">
            <th scope="col">Nombre</th>
            <th scope="col">Descripcion</th>
            <th class="text-end" scope="col">Acciones</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron lotes creados para este establecimiento.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(batch, index) in batches" :key="batch.batchName">
            <td>{{ batch.batchName }}</td>
            <td>{{ batch.description }}</td>
            <td class="text-end">
              <font-awesome-icon
                class="me-2"
                icon="edit"
                style="cursor: pointer; font-size: 20px"
                title="Editar bovinos del lote"
                @click="openDeleteBatchModal(batch)"
              >
              </font-awesome-icon>
              <font-awesome-icon
                icon="trash"
                style="cursor: pointer; font-size: 20px"
                title="Eliminar lote"
                @click="formDeleteBatch(batch.batchName, index, batch.establishmentCuig)"
              >
              </font-awesome-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="'¿Confirma que desea eliminar el lote ' + this.deleted['name'] + '?'"
    modal-id="DeleteModal"
    title="Eliminar"
    @acceptModal="modalDelete()"
    @rejectModal="
      this.deleteModal.hide();
      this.deleted = {};
    "
  ></confirmation-modal>
  <edit-batch-modal modalId="editBatchModal"></edit-batch-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import CemaInput from '../../components/form/CemaInput';
import EditBatchModal from '../../components/bovine/EditBatchModal';

export default {
  name: 'ListBatch',
  data() {
    return {
      batches: [],
      deleted: {},
      deleteModal: null,
      editBatchModal: null,
      timeout: false,
      delay: 250,
    };
  },
  components: {
    EditBatchModal,
    ConfirmationModal,
  },
  mounted() {
    this.editBatchModal = new Modal(document.getElementById('editBatchModal'));
    this.deleteModal = new Modal(document.getElementById('DeleteModal'));
    this.retrieveBatches();
  },
  methods: {
    ...mapActions('bovine', ['listBatches', 'deleteBatch', 'setupBatch']),
    setIndexForBatch(name, index, cuig) {
      this.deleted = {
        name: name,
        index: index,
        cuig: cuig,
      };
    },
    formDeleteBatch(name, index, cuig) {
      this.setIndexForBatch(name, index, cuig);
      this.deleteModal.show();
    },
    openDeleteBatchModal(batch) {
      if (batch) {
        this.setupBatch(Object.assign({}, batch));
      }
      this.editBatchModal.show();
    },
    async modalDelete() {
      console.log(`Deleting batch ${this.deleted['name']}`);
      this.deleteBatch(this.deleted).then(() => {
        this.batches.splice(this.deleted['index'], 1);
        this.deleted = {};
      });
    },
    async retrieveBatches() {
      this.batches = null;
      this.listBatches().then((response) => {
        this.batches = response.data;
        console.log(response);
      });
    },
  },
};
</script>
<style></style>
