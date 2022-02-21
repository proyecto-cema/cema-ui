<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId + 'Label'" class="modal-title">
            {{ edit ? 'Editar Enfermedad' : 'Registrar Enfermedad' }}
          </h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row ms-2 me-2">
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="disease.name"
                  :readonly="edit"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.name,
                    errorMessage: 'Ingrese el nombre de la enfermedad',
                  }"
                  input-title="Nombre"
                  input-id="name"
                  type="text"
                ></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model="disease.duration"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.duration,
                    errorMessage: 'Ingrese la duración de la enfermedad',
                  }"
                  input-title="Duración"
                  input-id="duration"
                  min="0"
                  type="number"
                ></cema-input>
              </div>
              <div class="mb-6 col-12 col-md-12">
                <cema-input
                  v-model.trim="disease.description"
                  maxlength="300"
                  component-type="textarea"
                  input-title="Descripción"
                  input-id="diseaseDescription"
                  type="text"
                  rows="2"
                ></cema-input>
              </div>
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
            @click="deleteDisease()"
          >
            Eliminar
          </button>
          <button class="btn btn-secondary text-white" :disabled="!disease.name" type="button" @click="saveModal()">
            {{ edit ? 'Modificar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { Modal } from 'bootstrap';
import CemaInput from '../form/CemaInput';

export default {
  name: 'DiseaseModal',
  emits: ['deleteModal', 'createdNew'],
  data() {
    return {
      owners: [],
      errorSave: {
        name: false,
        duration: false,
      },
    };
  },
  components: {
    CemaInput,
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('disease', ['disease', 'edit']),
    errorSaveHelper() {
      return {
        name: !this.disease.name,
        duration: !this.disease.duration,
      };
    },
  },
  methods: {
    ...mapActions('disease', ['saveDisease', 'deleteDisease', 'clearDiseaseData', 'setupEditDisease']),
    ...mapActions(['showSuccess']),
    clean() {
      this.errorSave = {};
      this.clearDiseaseData();
    },
    deleteDisease() {
      this.$emit('deleteModal', this.disease.name);
      this.clean();
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave);
        return;
      }
      this.commitSave();
    },
    async commitSave() {
      let editing = this.edit;
      this.saveDisease().then((response) => {
        this.showSuccess(`La enfermedad ${this.disease.name} se guardó correctamente`);
        this.setupEditDisease(this.disease);
        this.$emit('createdNew', { disease: this.disease, edit: editing });
      });
    },
  },
};
</script>
