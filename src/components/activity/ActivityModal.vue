<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId + 'Label'" class="modal-title">{{ modalTitle }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-lg-6 col-12">
                <div class="col-12 mb-3">
                  <cema-input
                    v-model="activityData.name"
                    input-title="Nombre"
                    input-id="name"
                    type="text"
                    :error-data="{
                      required: true,
                      errorStatus: errorSave.activityName,
                      errorMessage: 'Ingrese el nombre de la actividad',
                    }"
                  >
                  </cema-input>
                </div>
                <div class="col-12 mb-3">
                  <cema-input
                    v-model="activityData.type"
                    component-type="select"
                    required
                    :error-data="{
                      required: true,
                      errorStatus: errorSave.activityType,
                      errorMessage: 'Seleccione el tipo de actividad',
                    }"
                    input-title="Tipo de Actividad"
                    input-id="activityType"
                    :options="activitiesOptions"
                    optionKey="backendName"
                    :disabled="edit"
                  >
                    <template v-slot:default="{ option }">
                      {{ option.displayName }}
                    </template>
                  </cema-input>
                </div>
                <div class="col-12 mb-3">
                  <cema-input
                    v-model="activityData.executionDate"
                    required
                    :error-data="{
                      required: true,
                      errorStatus: errorSave.executionDate,
                      errorMessage: 'Seleccione la fecha de la actividad',
                    }"
                    input-title="Fecha de la Actividad"
                    input-id="executionDate"
                    type="date"
                  >
                  </cema-input>
                </div>
              </div>
              <div class="col-lg-6 col-12">
                <div class="col-12 mb-2">
                  <cema-input
                    v-model="activityData.workerUserName"
                    component-type="select"
                    input-title="Encargado"
                    input-id="workerName"
                    selected-option="Seleccione un encargado"
                    :error-data="{
                      required: true,
                      errorStatus: errorSave.workerUserName,
                      errorMessage: 'Ingrese quien realizara la actividad',
                    }"
                    :options="workers"
                    optionKey="userName"
                    v-slot="{ option }"
                  >
                    {{ option.name + ' ' + option.lastName }}
                  </cema-input>
                </div>
                <div class="col-12 mb-3">
                  <cema-input
                    v-model.trim="activityData.description"
                    maxlength="300"
                    component-type="textarea"
                    input-title="Observaciones"
                    input-id="vaccineDescription"
                    type="text"
                    rows="5"
                  >
                  </cema-input>
                </div>
              </div>
              <template v-if="activityData.type">
                <component v-bind:is="selectedActivityComponent" :error-save="errorSave"></component>
              </template>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal" type="button" @click="clean()">
            Cancelar
          </button>
          <button v-if="edit" class="btn btn-primary text-white" type="button" @click="clean()">Crear Nuevo</button>
          <button
            v-if="edit"
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
            type="button"
            @click="deleteModal()"
          >
            Eliminar
          </button>
          <button class="btn btn-secondary text-white" type="button" @click="saveModal()">
            {{ edit ? 'Modificar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from '../form/CemaInput';
import UltrasoundForm from '../../components/activity/UltrasoundForm';
import VaccinationForm from '../../components/activity/VaccinationForm';
import WeighingForm from '../../components/activity/WeighingForm';
import MovementForm from '../../components/activity/MovementForm';
import FeedingForm from '../../components/activity/FeedingForm';
import { mapActions, mapState } from 'vuex';
import { VALIDATIONS, ACTIVITIES_EXTRA_DATA, SEARCH_DEFAULT_TAG } from '../../constants';

export default {
  name: 'ActivityModal',
  emits: ['deletedActivity', 'savedActivity'],
  data() {
    return {
      errorSave: {},
      activitiesOptions: ACTIVITIES_EXTRA_DATA,
      workers: null,
    };
  },
  components: { CemaInput, VaccinationForm, WeighingForm, UltrasoundForm, MovementForm, FeedingForm },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.setCuigToDefault();
    this.searchWorkersNames();
    this.activityData.executionDate = this.getToday;
  },
  computed: {
    ...mapState('activity', ['edit', 'activityData']),
    getToday() {
      return this.getMomentToday();
    },
    activityMap() {
      return this.activitiesOptions[this.activityData.type];
    },
    selectedActivityComponent() {
      return this.activityMap.componentName;
    },
    modalTitle() {
      let name = this.activityData.type ? this.activityMap['displayName'] : 'Actividad';
      return this.edit ? `Editar ${name}` : `Registrar ${name}`;
    },
  },
  methods: {
    ...mapActions('activity', ['saveActivity', 'deleteActivity', 'clearActivityData', 'getWorkerList']),
    ...mapActions('bovine', ['setCuigToDefault']),
    ...mapActions(['showSuccess']),
    validate() {
      console.log(this.activityData);
      this.errorSave = {};
      this.errorSave['activityName'] = !this.activityData.name;
      this.errorSave['workerUserName'] = !this.activityData.workerUserName;
      this.errorSave['activityType'] = !this.activityData.type;
      this.errorSave['executionDate'] = !this.activityData.executionDate;
      this.errorSave['bovineBatch'] = this.activityData.extraData.isBatch && !this.activityData.extraData.batchName;
      this.errorSave['bovineTag'] =
        !this.activityData.extraData.isBatch &&
        (this.activityData.extraData.bovineTag === SEARCH_DEFAULT_TAG ||
          !this.activityData.extraData.bovineTag ||
          this.activityData.extraData.bovineTag === 'Bovino no encontrado');
      let validations = this.activityMap.validations;
      for (const key in validations) {
        this.errorSave[key] = VALIDATIONS[validations[key]](this.activityData.extraData[key]);
      }
      if (this.activityData.type === 'Feeding') {
        this.errorSave.amount = this.activityData.extraData.amount > this.activityData.extraData.supplyMaximum;
      }
    },
    hasErrors() {
      for (let errorKey in this.errorSave) {
        if (this.errorSave[errorKey]) {
          return true;
        }
      }
      return false;
    },
    clean() {
      this.errorSave = {};
      this.clearActivityData();
    },
    successCall(message) {
      this.showSuccess(message);
    },
    deleteModal() {
      let typeData = this.activityData.type;
      this.deleteActivity({ id: this.activityData.id, url: this.activityMap.url }).then(() => {
        this.successCall(
          `La actividad de ${this.activitiesOptions[typeData].displayName.toLowerCase()} fue eliminada correctamente`
        );
        this.$emit('deletedActivity');
      });
    },
    saveModal() {
      this.validate();
      if (this.hasErrors()) {
        console.error(this.errorSave);
        return;
      }
      this.formSaveActivity();
    },
    async formSaveActivity() {
      this.saveActivity(this.activityMap.url).then((activity) => {
        this.successCall(
          `Se guardó la actividad de ${this.activitiesOptions[activity.type].displayName.toLowerCase()} con nombre ${
            activity.name
          }`
        );
        this.$emit('savedActivity');
      });
    },
    async searchWorkersNames() {
      console.log('Checking workers');
      if (!this.workers) {
        console.log('Searching workers');
        this.getWorkerList().then((users) => {
          this.workers = users;
          console.log(users);
        });
      }
    },
  },
};
</script>

<style scoped></style>
