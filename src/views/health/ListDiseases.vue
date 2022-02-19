<template>
  <div class="tab-content" id="myTabContent">
    <div id="disease">
      <div class="text-center">
        <br />
        <h3>Listado De Enfermedades</h3>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
          <button class="btn btn-secondary text-white" type="button" v-on:click="openAddDiseaseModal(null)">
            + Nueva Enfermedad
          </button>
        </div>
        <div class="col-12 table-responsive">
          <table class="table">
            <caption>
              Mostrando
              {{
                diseasesLength
              }}
              de
              {{
                headers.totalElements
              }}
              Enfermedades
            </caption>
            <thead>
              <tr v-if="diseasesLength !== 0">
                <th scope="col">Nombre</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Duración(días)</th>
                <th class="text-end" scope="col">Acciones</th>
              </tr>
              <tr v-else>
                <th scope="col">No se encontraron resultados.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="disease in diseases" :key="disease.name">
                <td>{{ disease.name }}</td>
                <td>{{ disease.description }}</td>
                <td>{{ disease.duration }}</td>
                <td class="text-end">
                  <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddDiseaseModal(disease)">
                  </font-awesome-icon>
                  <font-awesome-icon
                    icon="trash"
                    @click.stop="formDeleteDisease(index, disease.name, disease.establishmentCuig)"
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
              v-on:click="this.searchDiseases(this.headers.currentPage - 1)"
            >
              Anterior
            </button>
            <button
              v-for="i in headers.totalPages"
              :key="i"
              :class="headers.currentPage === i - 1 ? 'btn-primary' : 'btn-outline-primary'"
              class="btn"
              type="button"
              v-on:click="this.searchDiseases(i - 1)"
            >
              {{ i }}
            </button>
            <button
              :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
              class="btn btn-outline-primary"
              type="button"
              v-on:click="this.searchDiseases(this.headers.currentPage + 1)"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="'¿Confirma que desea eliminar la enfermedad ' + deleted['name'] + '?'"
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
  <disease-modal
    modalId="addDiseaseModal"
    @createdNew="addDiseaseToList"
    @deleteModal="deleteDiseaseForm"
  ></disease-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import DiseaseModal from '../../components/health/DiseaseModal';

export default {
  name: 'ListDiseases',
  data() {
    return {
      diseases: [],
      diseasesLength: 0,
      deleteModal: null,
      deleted: {},
      results: { income: 0, expenses: 0, total: 0 },
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      addDiseaseModal: null,
    };
  },
  components: { ConfirmationModal, DiseaseModal },
  mounted() {
    this.searchDiseases(0, 10);
    this.addDiseaseModal = new Modal(document.getElementById('addDiseaseModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
  },
  methods: {
    ...mapActions('disease', ['listDiseases', 'setupEditDisease', 'deleteDisease']),
    ...mapActions(['showSuccess']),
    setIndexForName(index, name, cuig) {
      this.deleted = {
        name: name,
        index: index,
        cuig: cuig,
      };
    },
    formDeleteDisease(index, name, cuig) {
      this.setIndexForName(index, name, cuig);
      this.deleteModal.show();
    },
    closeDiseaseModal() {
      this.addDiseaseModal.hide();
    },
    openAddDiseaseModal(disease) {
      if (disease) {
        this.setupEditDisease(disease);
      }
      this.addDiseaseModal.show();
    },
    addDiseaseToList({ disease, edit }) {
      console.log(disease, edit);
      let helperDeleted = { ...this.deleted };
      if (edit) {
        this.disease.splice(helperDeleted.index, 1);
        this.deleted = {};
      }
      this.diseases.push(disease);
    },
    deleteDiseaseForm(name) {
      let index = null;
      for (let i = 0; i < this.diseases.length; i++) {
        if (this.diseases[i].name === name) {
          index = i;
          break;
        }
      }
      if (index === null) {
        console.error(`Searched disease: ${name}, was not found`);
        return;
      }
      this.setIndexForName(index, name);
      this.modalDelete();
    },
    async modalDelete() {
      let helperDeleted = { ...this.deleted };
      console.log(`Deleting disease ${helperDeleted.name}`);
      this.deleteDisease(this.deleted).then(() => {
        this.diseases.splice(helperDeleted.index, 1);
        this.showSuccess(`La enfermedad ${helperDeleted.name} se eliminó correctamente`);
        this.searchDiseases();
        this.deleted = {};
      });
    },
    async searchDiseases(page = 0, size = 10) {
      this.diseases = null;
      this.results = { income: 0, expenses: 0, total: 0 };

      this.listDiseases({ page: page, size: size }).then((response) => {
        this.diseases = response.data;
        console.log(response);
        console.log('enfermedades ' + this.diseases);
        console.log('enfermedades length ' + this.diseases.length);

        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);

        this.diseasesLength = this.diseases != null ? this.diseases.length : 0;

        this.resultCaculiation();
      });
    },
    async resultCaculiation() {
      console.log('enfermedades  ' + this.diseases);

      for (var i = 0; this.diseasesLength > i; i++) {
        if (this.diseases[i].diseaseType == 'sell') {
          this.results.income += this.diseases[i].amount;
        } else {
          this.results.expenses += this.diseases[i].amount;
        }
      }
      this.results.total = this.results.income - this.results.expenses;
    },
  },
};
</script>
<style></style>
