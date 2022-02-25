<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId + 'Label'" class="modal-title">
            {{ 'Registrar Seguimiento y Control de Enfermedad' }}
          </h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <ul class="nav nav-tabs mt-5" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="illness-tab"
              data-bs-toggle="tab"
              data-bs-target="#illness"
              type="button"
              role="tab"
              aria-controls="illness"
              aria-selected="true"
            >
              Enfermedad
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="follow-tab"
              data-bs-toggle="tab"
              data-bs-target="#follow"
              type="button"
              role="tab"
              aria-controls="follow"
              aria-selected="false"
            >
              Seguimiento
            </button>
          </li>
        </ul>
        <div class="tab-content" id="TabIllness">
          <!-- TAb 1 -->
          <div class="tab-pane fade show active" id="illness" role="tabpanel" aria-labelledby="illness-tab">
            <div class="modal-body">
              <form @submit.prevent="">
                <div class="row ms-2 me-2">
                  <div class="mb-3 col-12 col-md-12">
                    <tag-search :error-save="errorSave" :filters="['active']" />
                  </div>
                  <div class="mb-3 col-12 col-md-12">
                    <cema-input
                      v-model="illness.diseaseName"
                      component-type="select"
                      input-title="Enfermedad"
                      input-id="diseaseName"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.diseaseName,
                        errorMessage: 'Seleccione una enfermedad',
                      }"
                      :options="diseasesType"
                      optionKey="name"
                      v-slot="{ option }"
                    >
                      {{ option.name + ' - ' + option.duration + ' días' }}
                    </cema-input>
                  </div>
                  <div class="mb-6 col-12 col-md-6">
                    <cema-input
                      v-model="illness.startingDate"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.startingDate,
                        errorMessage: 'Ingrese la fecha de inicio de la enfermedad',
                      }"
                      input-title="Fecha de inicio de Enfermedad"
                      input-id="startingDate"
                      type="date"
                    >
                    </cema-input>
                  </div>
                  <div class="mb-6 col-12 col-md-6">
                    <cema-input
                      v-model="illness.endingDate"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.endingDate,
                        errorMessage: 'Ingrese la fecha de fin de la enfermedad',
                      }"
                      input-title="Fecha de fin de Enfermedad"
                      input-id="endingDate"
                      type="date"
                    >
                    </cema-input>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <!-- Tab 2 -->
          <div class="tab-pane fade" id="follow" role="tabpanel" aria-labelledby="follow-tab">
            <div class="row ms-2 me-2">
              <div class="mb-3 col-12 col-md-9">
                <cema-input
                  v-model.trim="observation"
                  maxlength="300"
                  required
                  component-type="textarea"
                  input-title="Observación"
                  input-id="Observation"
                  type="text"
                  rows="4"
                ></cema-input>
              </div>
              <div class="d-flex align-items-end mb-3 col-12 col-md-3">
                <button class="btn btn-secondary text-white" type="button" @click="addNotes()">Añadir</button>
              </div>
              <div class="col-12 table-responsive">
                <table class="table">
                  <thead>
                    <tr v-if="illness.notes !== 0">
                      <th scope="col">Fecha</th>
                      <th scope="col">Observacion</th>
                    </tr>
                    <tr v-else>
                      <th scope="col">No se encontraron resultados.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="note in illness.notes" :key="note.content">
                      <td>{{ note.creationDate }}</td>
                      <td>{{ note.content }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
            @click="deleteIllness()"
          >
            Eliminar
          </button>
          <button
            class="btn btn-secondary text-white"
            :disabled="!activityData.extraData.bovineTag"
            type="button"
            @click="saveModal()"
          >
            {{ edit ? 'Modificar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import TagSearch from '../activity/TagSearch';
import CemaInput from '../form/CemaInput';

export default {
  name: 'IllnessModal',
  emits: ['deleteModal', 'createdNew'],
  data() {
    return {
      diseasesType: [],
      observation: null,
      errorSave: {
        bovineTag: false,
        diseaseName: false,
        endingDate: false,
        startingDate: false,
      },
    };
  },
  components: {
    CemaInput,
    TagSearch,
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('illness', ['illness', 'edit']),
    ...mapState('activity', ['activityData']),
    errorSaveHelper() {
      return {
        bovineTag: !this.illness.bovineTag,
        diseaseName: !this.illness.diseaseName,
        endingDate: !this.illness.endingDate,
        startingDate: !this.illness.startingDate,
      };
    },
  },
  mounted() {
    this.searchDiseasesToList();
  },
  methods: {
    ...mapActions('illness', [
      'saveIllness',
      'deleteIllness',
      'clearIllnessData',
      'setupEditIllness',
      'addObservationToList',
    ]),
    ...mapActions('disease', ['listDiseases']),
    ...mapActions(['showSuccess']),
    clean() {
      this.errorSave = {};
      this.clearIllnessData();
    },
    deleteIllness() {
      this.$emit('deleteModal', this.illness.id);
      this.clean();
    },
    saveModal() {
      this.illness.bovineTag = this.activityData.extraData.bovineTag;
      console.log(this.illness);
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave);
        return;
      }
      this.commitSave();
    },
    async commitSave() {
      let editing = this.edit;
      this.saveIllness().then((response) => {
        this.showSuccess(
          `Se guardó el seguimiento de la enfermedad ${this.illness.diseaseName} del bovino con caravana ${this.illness.bovineTag}`
        );
        this.setupEditIllness(this.illness);
        this.$emit('createdNew', { illness: this.illness, edit: editing });
      });
    },
    async searchDiseasesToList(page = 0, size = 10) {
      this.listDiseases({ page: page, size: size }).then((response) => {
        this.diseasesType = response.data;
        console.log(response);
        console.log('DiseasesType:', this.diseasesType);
        console.log('DiseasesType:', this.diseasesType[0].name);
      });
    },
    addNotes() {
      if (this.observation == null) {
        return;
      }
      this.addNote = { content: this.observation, creationDate: this.getMomentToday('YYYY-MM-DD HH:mm:ss') };

      this.addObservationToList(this.addNote).then((response) => {
        console.log('Observación agregada ' + this.addNote);
        this.observation = null;
      });
    },
  },
};
</script>
<style></style>
