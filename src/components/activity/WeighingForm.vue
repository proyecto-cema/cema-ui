<template>
  <div class="col-12 mb-2">
    <tag-search :error-save="errorSave" :filters="['active']" />
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <cema-input
      v-model="activityData.extraData.weight"
      :error-data="{
        required: true,
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
    <cema-input v-model.trim="activityData.extraData.category" input-title="Categoría" input-id="category" type="text">
    </cema-input>
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
import { mapState } from 'vuex';
import TagSearch from './TagSearch';

export default {
  name: 'WeighingForm',
  components: { CemaInput, TagSearch },
  props: {
    errorSave: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapState('activity', ['activityData', 'edit']),
  },
  mounted() {
    if (!this.edit) {
      this.activityData.extraData = {
        isBatch: false,
      };
    }
  },
};
</script>

<style scoped></style>
