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
import { FILTERS, SEARCH_DEFAULT_TAG } from '../../constants';

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
    filters: {
      default: null,
      type: Array,
    },
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
      console.log('++++++++++++++++++++');
      let searchLength = searchingFor.length;
      console.log(searchingFor);
      let defaultSearch = {
        page: 0,
        size: 20,
        search: { tag: searchLength !== 0 ? searchingFor : null, cuig: this.selectedCuig },
      };
      if (searchLength === 0 || searchLength >= 1) {
        this.listBovines(defaultSearch).then((response) => {
          let bovines = response.data;
          if (this.filters) {
            bovines = bovines.filter((bovine) => this.checkFilter(bovine));
          }
          this.bovines = bovines.slice(0, 5);
          console.log('++++++++++++++++++++', response);
        });
      }
    },
    checkFilter(bovine) {
      let filterKey, filterBy;
      for (let i = 0; i < this.filters.length; i++) {
        filterKey = this.filters[i];
        filterBy = FILTERS[filterKey];
        if (filterBy.type === 'in') {
          return filterBy.filterSet.has(bovine['status']);
        } else if (filterBy.type === 'not in') {
          return !filterBy.filterSet.has(bovine['status']);
        }
      }
      return false;
    },
  },
};
</script>
