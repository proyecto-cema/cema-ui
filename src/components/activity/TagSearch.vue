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
      this.activityData.extraData.bovineTag = tag;
      this.searchBovines(tag).then((bovines) => {
        if (bovines.length === 0) {
          this.activityData.extraData.bovineTag = 'Bovino no encontrado';
          this.searchBovines();
        }
      });
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
      return this.listBovines(defaultSearch).then((response) => {
        let bovines = response.data;
        console.log('Pre filter', bovines);
        if (this.filters) {
          bovines = bovines.filter((bovine) => this.checkFilter(bovine));
        }
        console.log('After filter', bovines);
        if (bovines.length === 0) {
          console.log('No encontre nada');
        }
        this.bovines = bovines.slice(0, 5);
        console.log('Slice', bovines);
        console.log('++++++++++++++++++++', response);
        return Promise.resolve(bovines);
      });
    },
    checkFilter(bovine) {
      let filterKey, filterBy;
      let is_valid = true;
      for (let i = 0; i < this.filters.length; i++) {
        filterKey = this.filters[i];
        filterBy = FILTERS[filterKey];
        if (filterBy.type === 'in') {
          is_valid = is_valid && filterBy.filterSet.has(bovine[filterBy.field]);
        } else if (filterBy.type === 'not in') {
          is_valid = is_valid && !filterBy.filterSet.has(bovine[filterBy.field]);
        }
      }
      return is_valid;
    },
  },
};
</script>
