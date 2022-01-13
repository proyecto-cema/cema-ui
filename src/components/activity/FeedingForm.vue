<template>
  <div class="col-12 mb-2">
    <tag-search :error-save="errorSave" :filters="filterData" />
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <cema-input
      v-model="activityData.extraData.food"
      :error-data="{
        required: true,
        errorStatus: errorSave.food,
        errorMessage: 'Ingrese un alimento',
      }"
      input-title="Alimento"
      input-id="food"
      type="text"
    >
    </cema-input>
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <cema-input
      v-model="activityData.extraData.amount"
      :error-data="{
        required: true,
        errorStatus: errorSave.amount,
        errorMessage: 'Ingrese un número válido',
      }"
      input-title="Cantidad"
      input-id="amount"
      type="number"
      min="0"
    >
    </cema-input>
  </div>
</template>

<script>
import CemaInput from '../form/CemaInput';
import { mapState } from 'vuex';
import TagSearch from './TagSearch';
import { FILTERS } from '../../constants';

export default {
  name: 'FeedingForm',
  components: { CemaInput, TagSearch },
  props: {
    errorSave: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapState('activity', ['activityData', 'edit']),
    filterData() {
      return { active: FILTERS['active'] };
    },
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
