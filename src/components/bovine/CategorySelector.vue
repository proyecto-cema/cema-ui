<template>
  <cema-input
    v-model="categoryHelper"
    component-type="select"
    required
    input-title="Categoría"
    input-id="bovineCategory"
    :disabled="edit && (this.category === 'Vaca' || this.category === 'Toro')"
    :options="possibleCategories"
  ></cema-input>
</template>

<script>
import { BOVINE_CATEGORIES } from '../../constants';
import CemaInput from '../form/CemaInput';

export default {
  name: 'CategorySelector',
  emits: ['updateCategory'],
  components: { CemaInput },
  props: {
    bovine: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    possibleCategories() {
      if (this.genre == null || this.genre === 'Macho' || this.genre === 'Hembra') {
        return [...BOVINE_CATEGORIES[this.genre]];
      }
      return BOVINE_CATEGORIES['Todos'];
    },
    category() {
      return this.bovine.category || '';
    },
    genre() {
      return this.bovine.genre || '';
    },
    categoryHelper: {
      get() {
        return this.category;
      },
      set(value) {
        this.$emit('updateCategory', value);
      },
    },
  },
};
</script>

<style scoped></style>
