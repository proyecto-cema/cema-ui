<template>
  <div class="col-12 mb-2">
    <tag-search :error-save="errorSave" :filters="['active']" />
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <combo-search
      dropdown-id="food"
      input-title="Alimento"
      @reCall="getFeedingSupplies"
      :error-data="{
        required: true,
        errorStatus: errorSave.food,
        errorMessage: 'Ingrese un alimento',
      }"
      v-model="activityData.extraData.food"
      option-name="name"
      :options="supplies"
      defaultName="Seleccione el alimento"
    >
    </combo-search>
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <cema-input v-model="activityData.extraData.amount" input-title="Cantidad" input-id="amount" type="number" min="0">
    </cema-input>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CemaInput from '../form/CemaInput';
import ComboSearch from '../form/ComboSearch';
import TagSearch from './TagSearch';

export default {
  name: 'FeedingForm',
  components: { CemaInput, TagSearch, ComboSearch },
  props: {
    errorSave: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      supplies: [],
    };
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
  methods: {
    ...mapActions('activity', ['getFeedingSupplyList']),
    async getFeedingSupplies(searchingFor) {
      console.log('++++++++++++++++++++');
      let searchLength = searchingFor.length;
      console.log(searchingFor);
      let defaultSearch = {
        page: 0,
        size: 5,
        search: { name: searchLength !== 0 ? searchingFor : null },
      };
      if (searchLength === 0 || searchLength >= 1) {
        this.getFeedingSupplyList(defaultSearch).then((response) => {
          this.supplies = response.data;
          console.log('++++++++++++++++++++', response);
        });
      }
    },
  },
};
</script>

<style scoped></style>
