<template>
  <combo-search dropdown-id="tags" input-title="Caravana" @reCall="searchBovines"
                :error-data="{required: true, errorStatus: errorSave.bovineTag,
                  errorMessage: 'Seleccione la caravana'}"
                v-model="activityData.extraData.bovineTag"
                option-name="tag" :options="bovines"
                defaultName="Seleccione la caravana">
  </combo-search>
</template>
<script>
import ComboSearch from "../form/ComboSearch"
import {mapActions, mapState} from "vuex";

export default {
  name: 'tag-search',
  data(){
    return {
      bovines: []
    };
  },
  mounted() {
    this.searchBovines();
  },
  components: {ComboSearch},
  props: {
    errorSave: {},
  },
  computed: {
    ...mapState("activity", ["activityData"]),
    ...mapState("bovine", ["selectedCuig"]),
  },
  methods: {
    ...mapActions("bovine", ["listBovines"]),
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