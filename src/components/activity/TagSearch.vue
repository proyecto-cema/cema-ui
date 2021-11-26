<template>
  <combo-search
    dropdown-id="tags"
    input-title="Caravana"
    @reCall="searchBovines"
    :error-data="{ required: true, errorStatus: errorSave.bovineTag, errorMessage: default_search }"
    v-model="activityData.extraData.bovineTag"
    option-name="tag"
    :options="bovines"
    :defaultName="default_search"
  >
  </combo-search>
</template>
<script>
import ComboSearch from '../form/ComboSearch';
import { mapActions, mapState } from 'vuex';
import { SEARCH_DEFAULT_TAG } from '../../constants';

export default {
  name: 'tag-search',
  data() {
    return {
      bovines: [],
    };
  },
  mounted() {
    if (!this.edit) {
      this.activityData.extraData.bovineTag = this.default_search;
    }
    this.searchBovines();
  },
  components: { ComboSearch },
  props: {
    errorSave: {},
  },
  computed: {
    ...mapState('activity', ['activityData', 'edit']),
    ...mapState('bovine', ['selectedCuig']),
    default_search() {
      return SEARCH_DEFAULT_TAG;
    },
  },
  methods: {
    ...mapActions('bovine', ['listBovines']),
    async searchBovines(searchingFor = '') {
      let searchLength = searchingFor.length;
      console.log(searchingFor);
      let defaultSearch = {
        page: 0,
        size: 5,
        search: { tag: searchLength !== 0 ? searchingFor : null, cuig: this.selectedCuig },
      };
      if (searchLength === 0 || searchLength >= 1) {
        this.listBovines(defaultSearch).then((response) => {
          this.bovines = response.data;
          console.log(response);
        });
      }
    },
  },
};
</script>
