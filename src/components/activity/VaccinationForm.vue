<template>
  <batch-tag-switch :error-save="errorSave"></batch-tag-switch>
  <div class="mb-2"  :class="activityData.extraData.isBatch ? 'col-lg-6 col-12':'col-lg-4 col-12-6'">
    <cema-input v-model="activityData.extraData.brand"
                input-title="Marca" input-id="brand" type="text">
    </cema-input>
  </div>
  <div class="mb-2" :class="activityData.extraData.isBatch ? 'col-lg-6 col-12':'col-lg-4 col-6'">
    <cema-input v-model="activityData.extraData.drug"
                :error-data="{required: true, errorStatus: errorSave.drug,
                              errorMessage: 'Ingrese un producto'}"
                input-title="Producto" input-id="drug" type="text">
    </cema-input>
  </div>
  <div class="col-lg-4 col-6 mb-2">
    <cema-input v-model.trim="activityData.extraData.dose" v-if="!activityData.extraData.isBatch"
                input-title="Dosis" input-id="Dose" type="number" ></cema-input>
  </div>
</template>

<script>
import BatchTagSwitch from "./BatchTagSwitch";
import CemaInput from "../form/CemaInput";
import {mapState} from "vuex";

export default {
  name: "VaccinationForm",
  components: {CemaInput, BatchTagSwitch},
  props: {
    errorSave: {
      required: true,
      type: Object
    }
  },
  computed: {
    ...mapState("activity", ["activityData", "edit"]),
  },
  mounted() {
    if (!this.edit){
      this.activityData.extraData = {};
    }
  }
}
</script>

<style scoped>

</style>