<template>
  <div>
    <div class="mb-2">
      <combo-search
        :dropdown-id="this.dropdownId"
        input-title="Caravana"
        @reCall="searchBovines"
        :error-data="{ required: true, errorStatus: errorSave.bovineTag, errorMessage: default_search }"
        v-model="activityData.extraData.bovineTag"
        option-name="tag"
        :options="bovines"
        :defaultName="default_search"
      >
      </combo-search>
    </div>
    <div>
      <image-search v-if="!edit" @finishTagHandle="finishTagHandle"></image-search>
    </div>
  </div>
</template>
<script>
import ComboSearch from '../form/ComboSearch';
import { mapActions, mapState } from 'vuex';
import { FILTERS, SEARCH_DEFAULT_TAG } from '../../constants';
import ImageSearch from '../form/ImageSearch';

export default {
  name: 'tag-search',
  data() {
    return {
      bovines: [],
      dropdownId: 'tags',
    };
  },
  mounted() {
    if (!this.edit) {
      this.activityData.extraData.bovineTag = this.default_search;
    }
    this.searchBovines();
  },
  components: { ComboSearch, ImageSearch },
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
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    ...mapActions('bovine', ['listBovines']),
    finishTagHandle(tag) {
      let elementDropdown = document.getElementById(`dropdown-${this.dropdownId}`);
      let elementSearch = document.getElementById(`search-${this.dropdownId}`);
      elementDropdown.click();
      elementSearch.value = tag;
    },
    async searchBovines(searchingFor = '') {
      console.log('++++++++++++++++++++');
      let searchLength = searchingFor.length;
      console.log(searchingFor);
      let defaultSearch = {
        page: 0,
        size: 100,
        search: { tag: searchLength !== 0 ? searchingFor : null, cuig: this.currentUser.user.establishmentCuig },
      };
      this.listBovines(defaultSearch).then((response) => {
        let bovines = response.data;
        if (this.filters) {
          bovines = bovines.filter((bovine) => this.checkFilter(bovine));
        }
        this.bovines = bovines.slice(0, 5);
        console.log('++++++++++++++++++++', response);
      });
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
