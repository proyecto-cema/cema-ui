<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId + 'Label'" class="modal-title">{{ edit ? 'Editar Bovino' : 'Registrar Bovino' }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-lg-4 col-12 offset-lg-1">
                <div class="mb-3">
                  <cema-input
                    v-model.trim="bovine.tag"
                    maxlength="10"
                    required
                    :error-data="{
                      required: true,
                      errorStatus: errorSave.tag,
                      errorMessage: getTagError()['message'],
                    }"
                    input-title="Caravana"
                    input-id="bovineTag"
                    type="text"
                    :disabled="edit"
                  ></cema-input>
                </div>
                <div class="position-relative text-center">
                  <img
                    alt="Identificador"
                    class="imageIdBovine"
                    id="tagImg"
                    :src="!selectedImage ? require('../../assets/images/bovine/tag_bovino.png') : selectedImage"
                  />
                  <div class="TextCenterImage" v-if="!selectedImage">
                    <h4>{{ bovine.establishmentCuig }}<br />{{ bovine.tag }}</h4>
                  </div>
                </div>
                <div class="mt-3" v-if="!edit">
                  <input
                    type="file"
                    class="form-control-file"
                    id="bovineTagFile"
                    @change="recognize"
                    accept="image/*"
                    capture="environment"
                  />
                  <small>Puede subir una imagen para escanear la caravana</small>
                </div>
              </div>
              <div class="col-lg-6 col-12">
                <div class="row">
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="bovine.taggingDate"
                      :max="getToday"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.taggingDate,
                        errorMessage: 'Ingrese la fecha del caravaneo',
                      }"
                      input-title="Fecha de caravaneo"
                      input-id="bovineDate"
                      type="date"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="bovine.genre"
                      component-type="select"
                      required
                      :disabled="edit"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.genre,
                        errorMessage: 'Seleccione el sexo del bovino',
                      }"
                      input-title="Sexo"
                      input-id="bovineGenre"
                      @change="setCategories()"
                      :options="['Macho', 'Hembra']"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="bovine.birthDate"
                      :max="getToday"
                      input-title="Fecha de nacimiento"
                      input-id="birthDate"
                      type="date"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="bovine.category"
                      component-type="select"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.category,
                        errorMessage: 'Seleccione la categoria del bovino',
                      }"
                      input-title="Categoria"
                      input-id="bovineCategory"
                      :disabled="edit && (bovine.category == 'Vaca' || bovine.category == 'Toro')"
                      @change="unselectedStatus()"
                      :options="categories"
                    ></cema-input>
                  </div>
                  <div
                    class="col-lg-6 col-12 mb-3"
                    v-if="bovine.category == 'Ternero' || bovine.category == '' || bovine.category == null"
                  >
                    <cema-input
                      v-model="bovine.status"
                      component-type="select"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.status,
                        errorMessage: 'Seleccione el estado del bovino',
                      }"
                      input-title="Estado"
                      input-id="bovineStatus"
                      :disabled="bovine.category == ''"
                      :options="['Mamando', 'Destetado', 'Muerto', 'Vendido']"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3" v-if="bovine.category == 'Vaca'">
                    <cema-input
                      v-model="bovine.status"
                      component-type="select"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.status,
                        errorMessage: 'Seleccione el estado del bovino',
                      }"
                      :disabled="bovine.category == ''"
                      input-title="Estado"
                      input-id="bovineStatus"
                      :options="['Sin preñez', 'Preñada', 'Muerto', 'Vendido']"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3" v-if="bovine.category == 'Toro'">
                    <cema-input
                      v-model="bovine.status"
                      component-type="select"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.status,
                        errorMessage: 'Seleccione el estado del bovino',
                      }"
                      :disabled="bovine.category == ''"
                      input-title="Estado"
                      input-id="bovineStatus"
                      :options="['En servicio', 'Fuera de servicio', 'Muerto', 'Vendido']"
                    ></cema-input>
                  </div>
                  <div class="col-lg-12 col-12 mb-3">
                    <cema-input
                      v-model.trim="bovine.description"
                      maxlength="300"
                      component-type="textarea"
                      input-title="Descripción"
                      input-id="bovineDescription"
                      type="text"
                      rows="4"
                    ></cema-input>
                  </div>
                </div>
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
import CemaInput from '../form/CemaInput';
import { mapActions, mapState } from 'vuex';
import { REGEX_LETTERS_NUMBERS } from '../../constants';
import { createWorker } from 'tesseract.js';

const worker = createWorker({
  logger: (m) => console.log(m),
});

const MAX_WIDTH = 320;
const MAX_HEIGHT = 180;
const MIME_TYPE = 'image/jpeg';
const QUALITY = 0.7;

export default {
  name: 'BovineModal',
  data() {
    return {
      selectedImage: null,
      errorSave: {
        tag: false,
        taggingDate: false,
        genre: false,
        category: false,
        status: false,
      },
    };
  },
  components: { CemaInput },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('bovine', ['bovine', 'edit', 'categories']),
    getToday() {
      return this.getMomentToday();
    },
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
    ...mapActions('bovine', ['getBovine', 'saveBovine', 'setupEditBovine', 'clearBovineData', 'setupCategories']),
    ...mapActions(['showSuccess']),
    unselectedStatus() {
      this.bovine.status = '';
    },
    setCategories() {
      this.bovine.category = '';
      this.setupCategories(this.bovine.genre);
    },
    getTagError() {
      let message = 'Ingrese el número de caravana del bovino.';
      let isValid = !!this.bovine.tag;
      let testRegex = REGEX_LETTERS_NUMBERS.test(this.bovine.tag);
      if (isValid && !testRegex) {
        message = 'La caravana ingresada no es valida. Solo se permiten numeros y letras.';
        isValid = false;
      }
      return { isValid: isValid, message: message };
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
    async recognize(e) {
      let files = e.target.files;
      if (!files.length) return;
      this.selectedImage = URL.createObjectURL(files[0]);

      const img = document.getElementById('tagImg');
      const [newWidth, newHeight] = this.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob((blob) => {}, MIME_TYPE, QUALITY);

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const {
        data: { text },
      } = await worker.recognize(img);
      console.log(text);
      this.bovine.tag = text;
    },

    calculateSize(img, maxWidth, maxHeight) {
      let width = img.width;
      let height = img.height;

      // calculate the width and height, constraining the proportions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      return [width, height];
    },
  },
};
</script>

<style scoped>
.TextCenterImage {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.imageIdBovine {
  width: 60% !important;
}
</style>
