<template>
  <div class="col-12 col-lg-4 mb-2 mt-4 d-flex justify-content-center">
    <cema-switch v-model="activityData.extraData.isBatch"></cema-switch>
  </div>
  <div class="col-12 col-lg-8 mb-3" v-if="!activityData.extraData.isBatch">
    <combo-search dropdown-id="tags" input-title="Caravana" @reCall="searchBovines"
                  :error-data="{required: true, errorStatus: errorSave.bovineTag,
                  errorMessage: 'Seleccione la caravana'}"
                  option-name="tag" v-model="activityData.extraData.bovineTag" :options="bovines"
                  defaultName="Seleccione la caravana">
    </combo-search>
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
import ComboSearch from "../form/ComboSearch";
import CemaInput from "../form/CemaInput";
import {mapActions, mapState} from "vuex";

export default {
  name: "BatchTagSwitch",
  data(){
    return {
      batches: [],
      bovines: []
    };
  },
  props: {
    errorSave: {
      required: true,
      type: Object
    }
  },
  components: {CemaInput, CemaSwitch, ComboSearch},
  mounted() {
    this.searchBovines();
    this.searchBatches();
  },
  computed: {
    ...mapState("bovine", ["selectedCuig"]),
    ...mapState("activity", ["activityData"]),
  },
  methods: {
    ...mapActions("bovine", ["listBovines", "listBatches"]),
    async searchBatches() {
      this.listBatches().then(
          (response) => {
            console.log(response.data)
            this.batches = response.data;
          }
      )
    },
    async searchBovines(searchingFor="") {
      let searchLength = searchingFor.length;
      console.log(searchingFor);
      let defaultSearch = {page: 0, size: 10, search: {tag: searchLength !== 0 ? searchingFor: null, cuig: this.selectedCuig}};
      if (searchLength === 0 || searchLength >= 1) {
        this.listBovines(defaultSearch).then(
            (response) => {
              this.bovines = response.data;
              console.log(response);
            }
        )
      }
    }
  }
}
</script>

<style scoped>

</style>