<template>
  <div class="col-12 col-lg-4 mb-2 mt-4 d-flex justify-content-center">
    <cema-switch v-model="activityData.extraData.isBatch"></cema-switch>
  </div>
  <div class="col-12 col-lg-8 mb-3" v-if="!activityData.extraData.isBatch">
    <tag-search :error-save="errorSave"/>
  </div>
  <div class="col-12 col-lg-8 mb-3" v-else>
    <cema-input v-model="activityData.extraData.batchName" component-type="select" required
                :error-data="{required: true, errorStatus: errorSave.bovineBatch,
                              errorMessage: 'Seleccione un lote'}"
                input-title="Lote" input-id="batchName"
                :options="batches.filter(o => o.establishmentCuig === selectedCuig)" optionKey="batchName">
      <template v-slot:default="{ option }">
        {{ option.batchName }}
      </template>
    </cema-input>
  </div>
</template>

<script>
import CemaSwitch from "../form/CemaSwitch";
import CemaInput from "../form/CemaInput";
import {mapActions, mapState} from "vuex";
import TagSearch from "./TagSearch";

export default {
  name: "BatchTagSwitch",
  data(){
    return {
      batches: []
    };
  },
  props: {
    errorSave: {
      required: true,
      type: Object
    }
  },
  components: {TagSearch, CemaInput, CemaSwitch},
  mounted() {
    this.searchBatches();
  },
  computed: {
    ...mapState("activity", ["activityData"]),
    ...mapState("bovine", ["selectedCuig"]),
  },
  methods: {
    ...mapActions("bovine", ["listBatches"]),
    async searchBatches() {
      this.listBatches().then(
          (response) => {
            console.log(response.data)
            this.batches = response.data;
          }
      )
    }
  }
}
</script>

