<template>
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
            :src="require('../../assets/images/bovine/tag_bovino.png')"
          />
          <div class="TextCenterImage" v-if="!this.selectedImage">
            <h4>{{ bovine.establishmentCuig }}<br />{{ bovine.tag }}</h4>
          </div>
        </div>
        <div class="mt-3" v-if="!edit">
          <image-search img-id-external="tagImg" @finishTagHandle="finishTagHandle"></image-search>
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
            <category-selector
              @update-category="updateCategory"
              :bovine="bovine"
              :edit="edit"
              :error-data="{
                required: true,
                errorStatus: errorSave.category,
                errorMessage: 'Seleccione la categoría del bovino',
              }"
              @change="unselectedStatus()"
            ></category-selector>
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
              :disabled="bovine.category == '' || bovine.status == 'Muerto' || bovine.status == 'Vendido'"
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

import CategorySelector from './CategorySelector';
import { BOVINE_STATUS } from '../../constants';
import ImageSearch from '../form/ImageSearch';

export default {
  name: 'BovineModal',
  components: { CemaInput, CategorySelector, ImageSearch },
  props: {
    errorSave: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('bovine', ['bovine', 'edit', 'selectedImage']),
    getToday() {
      return this.getMomentToday();
    },
    possibleStatus() {
      if (this.edit) {
        return [...BOVINE_STATUS[this.bovine.category], ...BOVINE_STATUS['Todos']];
      }
      return BOVINE_STATUS[this.bovine.category];
    },
  },
  methods: {
    ...mapActions('bovine', ['setupSelectedImage']),
    updateCategory(value) {
      this.bovine.category = value;
    },
    getTagError() {
      return this.tagHasError(this.bovine.tag);
    },
    unselectedStatus() {
      this.bovine.status = '';
    },
    resetCategories() {
      this.bovine.category = '';
    },
    finishTagHandle(tag) {
      this.setupSelectedImage(tag);
      this.bovine.tag = tag;
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
