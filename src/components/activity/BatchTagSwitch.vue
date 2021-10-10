<template>
  <div class="col-6 mb-2 offset-3 mt-3">
    <cema-switch v-model="isBatch"></cema-switch>
  </div>
  <div class="col-12 mb-3" v-if="!isBatch">
    <combo-search dropdown-id="tags" input-title="Caravana" @reCall="searchBovines"
                  :error-data="{required: true, errorStatus: errorSave.bovineTag, errorMessage: 'Seleccione la caravana'}"
                  option-name="tag" v-model="data.bovineTag" :options="bovines"
                  defaultName="Seleccione la caravana">
    </combo-search>
  </div>
  <div class="col-12 mb-3" v-else>
    <cema-input v-model="data.batchName" component-type="select" required
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
      data: {},
      extraData: {},
      errorSave: {
        bovineTag: false,
        batchName: false,
      },
      isBatch: false,
      batches: [],
      bovines: []
    };
  },
  components: {CemaInput, CemaSwitch, ComboSearch},
  mounted() {
    this.searchBovines();
    this.searchBatches();
  },
  computed: {
    ...mapState("bovine", ["selectedCuig"]),
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
      let defaultSearch = {page: 0, size: 10, search: {tag: searchLength !== 0 ? searchingFor: null}};
      if (searchLength === 0 || searchLength >= 2) {
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