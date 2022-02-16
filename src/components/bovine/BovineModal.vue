<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId + 'Label'" class="modal-title">{{ edit ? 'Editar Bovino' : 'Registrar Bovino' }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <bovine-modal-content :error-save="errorSave"></bovine-modal-content>
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
          <button class="btn btn-secondary text-white" :disabled="!bovine.tag" type="button" @click="saveModal()">
            {{ edit ? 'Modificar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BovineModalContent from '../bovine/BovineModalContent';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'BovineModal',
  data() {
    return {
      errorSave: {
        tag: false,
        taggingDate: false,
        genre: false,
        category: false,
        status: false,
      },
    };
  },
  components: { BovineModalContent },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('bovine', ['bovine', 'edit']),
    errorSaveHelper() {
      return {
        tag: !this.getTagError()['isValid'],
        taggingDate: !this.bovine.taggingDate,
        genre: !this.bovine.genre,
        category: !this.bovine.category,
        status: !this.bovine.status,
      };
    },
  },
  methods: {
    ...mapActions('bovine', ['saveBovine', 'setupEditBovine', 'clearBovineData']),
    ...mapActions(['showSuccess']),

    getTagError() {
      return this.tagHasError(this.bovine.tag);
    },
    clean() {
      this.errorSave = {};
      this.clearBovineData();
    },
    successCall(message) {
      this.showSuccess(message);
    },
    deleteModal() {
      this.$emit('deleteModal', this.bovine.tag);
      this.clean();
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave);
        return;
      }
      this.formSaveBovine();
    },
    async formSaveBovine() {
      let data = {
        edit: this.edit,
        bovine: this.bovine,
      };
      this.saveBovine(data).then((bovine) => {
        this.successCall(`El bovino con caravana ${bovine.establishmentCuig}-${bovine.tag} se guardó correctamente`);
        this.setupEditBovine(bovine);
      });
    },
  },
};
</script>

<style scoped></style>
