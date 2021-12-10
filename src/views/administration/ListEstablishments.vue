<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button"
              v-on:click="openAddEstablishmentModal(null)">
        + Nuevo Establecimiento
      </button>
    </div>
    <div class="mt-2">
      <h3>Listado de Establecimientos</h3>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>
          {{
            `Mostrando ${establishmentsLength} de ${establishmentsLength} establecimientos`
          }}
        </caption>
        <thead>
          <tr v-if="establishmentsLength !== 0">
            <th scope="col">CUIG</th>
            <th scope="col">Nombre</th>
            <th scope="col">Propietario</th>
            <th class="text-end" scope="col">Acciones</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron resultados.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(establishment, index) in establishments" :key="establishment.cuig">
            <td>{{ establishment.cuig }}</td>
            <td>{{ establishment.name }}</td>
            <td>{{ establishment.ownerUserName }}</td>
            <td class="text-end">
              <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddEstablishmentModal(establishment)">
              </font-awesome-icon>
              <font-awesome-icon icon="trash" @click.stop="formDeleteEstablishment(index, establishment.cuig)">
              </font-awesome-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="'¿Confirma que desea eliminar el establecimiento con CUIG ' + deleted['cuig'] + '?'"
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
  <establishment-modal
    modalId="addEstablishmentModal"
    @deleteModal="deleteEstablishmentForm"
    @createdNew="addEstablishmentToList"
  ></establishment-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import EstablishmentModal from '../../components/administration/EstablishmentModal';

export default {
  name: 'ListEstablishments',
  data() {
    return {
      establishments: [],
      establishmentsLength: 0,
      deleted: {},
      deleteModal: null,
      addEstablishmentModal: null,
      timeout: false,
      delay: 250,
    };
  },
  components: { ConfirmationModal, EstablishmentModal },
  mounted() {
    this.addEstablishmentModal = new Modal(document.getElementById('addEstablishmentModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
    this.searchEstablishments();
  },
  methods: {
    ...mapActions('establishment', ['listEstablishments', 'setupEditEstablishment', 'deleteEstablishment']),
    ...mapActions(['showSuccess']),
    setIndexForCuig(index, cuig) {
      this.deleted = {
        cuig: cuig,
        index: index,
      };
    },
    formDeleteEstablishment(index, cuig) {
      this.setIndexForCuig(index, cuig);
      this.deleteModal.show();
    },
    openAddEstablishmentModal(establishment) {
      if (establishment) {
        this.setupEditEstablishment(establishment);
      }
      this.addEstablishmentModal.show();
    },
    deleteEstablishmentForm(cuig) {
      let index = null;
      for (let i = 0; i < this.establishments.length; i++) {
        if (this.establishments[i].cuig === cuig) {
          index = i;
          console.log(`Searched cuig: ${cuig}, found at ${index}`);
          break;
        }
      }
      if (index === null) {
        console.error(`Searched cuig: ${cuig}, was not found`);
        return;
      }
      this.setIndexForCuig(index, cuig);
      this.modalDelete();
    },
    addEstablishmentToList({ establishment, edit }) {
      console.log(establishment, edit);
      if (!edit) {
        this.establishments.push(establishment);
      }
    },
    async modalDelete() {
      let helperDeleted = { ...this.deleted };
      console.log(`Deleting establishment ${helperDeleted.cuig}`);
      this.deleteEstablishment(helperDeleted).then(() => {
        this.establishments.splice(helperDeleted.index, 1);
        this.showSuccess(`El establecimiento con CUIG ${helperDeleted.cuig} se eliminó correctamente`);
        this.deleted = {};
      });
    },
    async searchEstablishments() {
      this.establishments = null;
      this.listEstablishments().then((response) => {
        this.establishments = response.data;
        console.log(response);
        this.establishmentsLength = this.establishments != null ? this.establishments.length : 0;
      });
    },
  },
};
</script>
<style></style>
