<template>
  <form @submit.prevent="">
    <div class="row">
      <div class="col-lg-4 col-12">
        <div class="position-relative text-center">
          <img alt="Identificador" class="imageIdBovine" src="../../assets/images/bovine/tag_bovino.png" />
          <div class="TextCenterImage">
            <h4>{{ bovine.establishmentCuig }}<br />{{ bovine.tag }}</h4>
          </div>
        </div>
      </div>
      <div class="col-lg-7 col-12">
        <div class="row">
          <div class="col-lg-6 col-12 mb-3">
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
              @change="resetCategories()"
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
                errorMessage: 'Seleccione la categoría del bovino',
              }"
              input-title="Categoría"
              input-id="bovineCategory"
              :disabled="edit && (bovine.category == 'Vaca' || bovine.category == 'Toro')"
              @change="unselectedStatus()"
              :options="possibleCategories"
            ></cema-input>
          </div>
          <div class="col-lg-6 col-12 mb-3">
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
              :options="possibleStatus"
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
</template>

<script>
import CemaInput from '../form/CemaInput';
import { mapActions, mapState } from 'vuex';

import { BOVINE_CATEGORIES, BOVINE_STATUS } from '../../constants';

export default {
  name: 'BovineModal',
  components: { CemaInput },
  props: {
    errorSave: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('bovine', ['bovine', 'edit', 'categories']),
    getToday() {
      return this.getMomentToday();
    },
    possibleStatus() {
      if (this.edit) {
        return [...BOVINE_STATUS[this.bovine.category], ...BOVINE_STATUS['Todos']];
      }
      return BOVINE_STATUS[this.bovine.category];
    },
    possibleCategories() {
      if (this.bovine.genre == null || this.bovine.genre == 'Macho' || this.bovine.genre == 'Hembra') {
        return [...BOVINE_CATEGORIES[this.bovine.genre]];
      }
      return BOVINE_CATEGORIES['Todos'];
    },
  },
  methods: {
    ...mapActions('bovine', ['setupCategories']),
    getTagError() {
      return this.tagHasError(this.bovine.tag);
    },
    unselectedStatus() {
      this.bovine.status = '';
    },
    resetCategories() {
      this.bovine.category = '';
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
