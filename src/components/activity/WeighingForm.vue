<template>
  <div class="col-12 mb-2">
    <tag-search :error-save="errorSave" :filters="['active']" @call-update="setGenre" />
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <cema-input
      v-model="activityData.extraData.weight"
      :error-data="{
        required: false,
        errorStatus: errorSave.weight,
        errorMessage: 'Ingrese un número válido',
      }"
      input-title="Peso"
      input-id="weight"
      type="number"
      min="0"
    >
    </cema-input>
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <category-selector
      :disabled="activityData.extraData['category']"
      :bovine="activityData.extraData"
      @update-category="updateCategory"
    ></category-selector>
  </div>
  <div class="col-lg-12 col-12 mb-2">
    <cema-input
      v-model.trim="activityData.extraData.dentalNotes"
      input-title="Notas dentadura"
      input-id="dental_notes"
      type="text"
    >
    </cema-input>
  </div>
</template>

<script>
import CemaInput from '../form/CemaInput';
import { mapActions, mapState } from 'vuex';
import TagSearch from './TagSearch';
import CategorySelector from '../bovine/CategorySelector';

export default {
  name: 'WeighingForm',
  components: { CemaInput, TagSearch, CategorySelector },
  props: {
    errorSave: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapState('activity', ['activityData', 'edit']),
  },
  methods: {
    ...mapActions('bovine', ['getBovine']),
    async setGenre() {
      this.getBovine({ tag: this.activityData.extraData.bovineTag, doCommit: false }).then((bovine) => {
        console.log(bovine);
        if (bovine.status === 'Vendido') {
          this.showErrorFront(`Esta caravana ${bovine.tag} ya se encuentra en estado vendido.`);
        } else {
          this.activityData.extraData.category = bovine.category;
          this.activityData.extraData.genre = bovine.genre;
        }
      });
    },
    updateCategory(value) {
      this.activityData.extraData.category = value;
    },
  },
  mounted() {
    if (!this.edit) {
      this.activityData.extraData = {
        isBatch: false,
      };
    } else {
      this.setGenre();
    }
  },
};
</script>

<style scoped></style>
