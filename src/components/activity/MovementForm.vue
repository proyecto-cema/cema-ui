<template>
  <batch-tag-switch :error-save="errorSave"></batch-tag-switch>
  <div class="col-12 mb-2">
    <cema-input
      v-model="activityData.extraData.location"
      component-type="select"
      required
      :error-data="{ required: true, errorStatus: errorSave.location, errorMessage: 'Seleccione una ubicación' }"
      input-title="Ubicación"
      input-id="location"
      selected-option="Seleccionar"
      :options="locations"
      optionKey="name"
    >
      <template v-slot:default="{ option }">
        {{ option.name }}
      </template>
    </cema-input>
  </div>
</template>

<script>
import BatchTagSwitch from './BatchTagSwitch';
import CemaInput from '../form/CemaInput';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'MovementForm',
  components: { CemaInput, BatchTagSwitch },
  props: {
    errorSave: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      locations: [],
    };
  },
  computed: {
    ...mapState('activity', ['activityData', 'edit']),
  },
  mounted() {
    if (!this.edit) {
      this.activityData.extraData = { location: '' };
    }
    this.getLocations();
  },
  methods: {
    ...mapActions('location', ['listLocations']),
    async getLocations() {
      this.listLocations().then((response) => {
        this.locations = response.data;
      });
    },
  },
};
</script>

<style scoped></style>
