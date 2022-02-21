<template>
  <div class="tab-pane fade show active" id="illness-list" role="tabpanel" aria-labelledby="illness-tab">
    <div class="text-center">
      <br />
      <h3>Listado De Seguimiento de Enfermedades</h3>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
        <button class="btn btn-secondary text-white" type="button" v-on:click="openAddIllnessModal(null)">
          + Nueva Seguimiento de Enfermedad
        </button>
      </div>
      <div class="col-12 table-responsive">
        <table class="table">
          <caption>
            Mostrando
            {{
              illnessesLength
            }}
            de
            {{
              headers.totalElements
            }}
            Enfermedades
          </caption>
          <thead>
            <tr v-if="illnessesLength !== 0">
              <th scope="col">Caravana</th>
              <th scope="col">Enfermedad</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Fin</th>
              <th class="text-end" scope="col">Acciones</th>
            </tr>
            <tr v-else>
              <th scope="col">No se encontraron resultados.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="illness in illnesses" :key="illness.id">
              <td>{{ illness.bovineTag }}</td>
              <td>{{ illness.diseaseName }}</td>
              <td>{{ this.javaDateToMomentDate(illness.startingDate) }}</td>
              <td>{{ this.javaDateToMomentDate(illness.endingDate) }}</td>
              <td class="text-end">
                <font-awesome-icon class="me-2" icon="edit" @click.stop="openAddIllnessModal(illness)">
                </font-awesome-icon>
                <font-awesome-icon
                  icon="trash"
                  @click.stop="formDeleteIllness(index, illness.id, illness.bovineTag, illness.diseaseName)"
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
            v-on:click="this.searchIllnesses(this.headers.currentPage - 1)"
          >
            Anterior
          </button>
          <button
            v-for="i in headers.totalPages"
            :key="i"
            :class="headers.currentPage === i - 1 ? 'btn-primary' : 'btn-outline-primary'"
            class="btn"
            type="button"
            v-on:click="this.searchIllnesses(i - 1)"
          >
            {{ i }}
          </button>
          <button
            :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
            class="btn btn-outline-primary"
            type="button"
            v-on:click="this.searchIllnesses(this.headers.currentPage + 1)"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="
      '¿Confirma que desea eliminar el seguimiento de la enfermedad ' +
      deleted['diseaseName'] +
      ' del bovino ' +
      deleted['bovineTag'] +
      '?'
    "
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
  <illness-modal
    modalId="addIllnessModal"
    @createdNew="addIllnessToList"
    @deleteModal="deleteIllnessForm"
  ></illness-modal>
</template>

<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import utils from '../../utils';
import IllnessModal from '../../components/health/IllnessModal';

export default {
  name: 'ListIllness',
  data() {
    return {
      illnesses: [],
      illnessesLength: 0,
      deleteModal: null,
      deleted: {},
      results: { income: 0, expenses: 0, total: 0 },
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      addIllnessModal: null,
    };
  },
  props: {
    options: {},
    modelValue: {},
  },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  components: {
    ConfirmationModal,
    IllnessModal,
  },
  props: {},
  mounted() {
    this.searchIllnesses(0, 10);
    this.addIllnessModal = new Modal(document.getElementById('addIllnessModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
  },
  methods: {
    ...mapActions('illness', ['listIllnesses', 'setupEditIllness', 'deleteIllness']),
    ...mapActions(['showSuccess']),
    setIndexForId(index, id, bovineTag, diseaseName) {
      this.deleted = {
        index: index,
        id: id,
        bovineTag: bovineTag,
        diseaseName: diseaseName,
      };
    },
    formDeleteIllness(index, id, bovineTag, diseaseName) {
      this.setIndexForId(index, id, bovineTag, diseaseName);
      this.deleteModal.show();
    },
    closeIllnessModal() {
      this.addIllnessModal.hide();
    },
    openAddIllnessModal(illness) {
      if (illness) {
        this.setupEditIllness(illness);
      }
      this.addIllnessModal.show();
    },
    addIllnessToList({ illness, edit }) {
      console.log(illness, edit);
      let helperDeleted = { ...this.deleted };
      if (edit) {
        this.illness.splice(helperDeleted.index, 1);
        this.deleted = {};
      }
      this.illnesses.push(illness);
    },
    deleteIllnessForm(id) {
      let index = null;
      for (let i = 0; i < this.illnesses.length; i++) {
        if (this.illnesses[i].id === id) {
          index = i;
          break;
        }
      }
      if (index === null) {
        console.error(`Searched illness: ${id}, was not found`);
        return;
      }
      this.setIndexForId(index, id);
      this.modalDelete();
    },
    async modalDelete() {
      let helperDeleted = { ...this.deleted };
      console.log(`Deleting illness ${helperDeleted.bovineTag}`);
      this.deleteIllness(this.deleted).then(() => {
        this.illnesses.splice(helperDeleted.index, 1);
        this.showSuccess(
          'El seguimiento de la enfermedad ' +
            this.deleted.diseaseName +
            ' del bovino con caravana ' +
            this.deleted.bovineTag +
            ' se eliminó correctamente'
        );
        this.searchIllnesses();
        this.deleted = {};
      });
    },
    async searchIllnesses(page = 0, size = 10) {
      this.illnesses = null;
      this.results = { income: 0, expenses: 0, total: 0 };

      this.listIllnesses({ page: page, size: size }).then((response) => {
        this.illnesses = response.data;
        for (let i = 0; this.illnesses.length > i; i++) {
          this.illnesses[i].startingDate = utils.methods.javaDateToMomentDate(
            this.illnesses[i].startingDate,
            'YYYY-MM-DD'
          );
          this.illnesses[i].endingDate = utils.methods.javaDateToMomentDate(this.illnesses[i].endingDate, 'YYYY-MM-DD');
        }
        console.log(response);
        console.log('enfermedades ' + this.illnesses);

        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);

        this.illnessesLength = this.illnesses != null ? this.illnesses.length : 0;

        this.resultCaculiation();
      });
    },
    async resultCaculiation() {
      console.log('enfermedades  ' + this.illnesses);

      for (var i = 0; this.illnessesLength > i; i++) {
        if (this.illnesses[i].illnessType == 'sell') {
          this.results.income += this.illnesses[i].amount;
        } else {
          this.results.expenses += this.illnesses[i].amount;
        }
      }
      this.results.total = this.results.income - this.results.expenses;
    },
  },
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #a3a1a1;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--bs-secondary);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(45px);
}

.slider:after {
  color: white;
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  font-size: 10px;
  font-family: Verdana, sans-serif;
}
</style>
