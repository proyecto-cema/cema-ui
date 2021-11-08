<template>
  <div class="col-12 mb-2">
    <tag-search :error-save="errorSave"/>
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <cema-input v-model="activityData.extraData.serviceNumber" type="number"
                input-title="Número de servicio" input-id="serviceNumber" ></cema-input>
  </div>
  <div class="col-lg-6 col-12 mb-2">
    <cema-input v-model.trim="activityData.extraData.resultStatus"
                input-title="Resultado" input-id="resultStatus" type="text" >
    </cema-input>
  </div>
</template>

<script>
import CemaInput from "../form/CemaInput";
import {mapState} from "vuex";
import TagSearch from "./TagSearch";

export default {
  name: "UltrasoundForm",
  components: {CemaInput, TagSearch},
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
      this.activityData.extraData = {
        isBatch: false
      };
    }
  }
}
</script>

<style scoped>

</style>