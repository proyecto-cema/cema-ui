<template>
  <label v-if="label" :for="finalDropdownId" class="form-label">
    {{ inputTitle }}
    <small v-if="errorData.required" style="color: red">*</small>
  </label>
  <div class="dropdown">
    <button
      class="form-select text-start"
      type="button"
      :id="finalDropdownId"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      @click="focusSearch()"
      aria-expanded="false"
    >
      {{ value ? value : defaultName }}
    </button>
    <ul class="dropdown-menu w-100" :aria-labelledby="finalDropdownId">
      <li class="input-group">
        <input class="form-control" :id="searchId" type="text" autocomplete="off" v-model="searchValue" />
        <button
          class="btn"
          type="button"
          @click.prevent="
            searchValue = '';
            reCall();
          "
        >
          <font-awesome-icon icon="times"></font-awesome-icon>
        </button>
      </li>
      <template v-for="option in filteredOptions" :key="option[optionName]">
        <li>
          <button class="dropdown-item" type="button" @click="selected(option[optionName])">
            {{ option[optionName] }}
          </button>
        </li>
      </template>
      <template v-if="0 < searchValue.length && filteredOptions.length <= 3 && maintain !== searchValue">
        <li>
          <button class="dropdown-item" type="button" @click="reCall()">
            <b>Buscar mas para {{ searchValue }}</b>
          </button>
        </li>
      </template>
      <li v-if="extraOption.length > 0">
        <button class="dropdown-item" type="button" @click="selected(extraOption['key'])">
          {{ extraOption['value'] }}
          <font-awesome-icon v-if="extraOption['icon']" class="ms-1" :icon="extraOption['icon']"></font-awesome-icon>
        </button>
      </li>
    </ul>
  </div>
  <div v-if="errorData.required && errorData.errorStatus" class="textError">
    <span class="is-invalid"></span> {{ errorData.errorMessage }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
      maintain: null,
      localOptions: [],
    };
  },
  name: 'ComboSearch',
  emits: ['reCall', 'update:modelValue'],
  props: {
    dropdownId: {
      type: String,
      required: true,
    },
    optionName: {
      type: String,
      required: true,
    },
    errorData: {
      type: Object,
      default: function () {
        return { required: false };
      },
    },
    inputTitle: {
      type: String,
      required: true,
    },
    label: {
      type: Boolean,
      default: true,
    },
    extraOption: {
      type: Object,
      default: function () {
        return {};
      },
    },
    withCaller: {
      type: Boolean,
      default: false,
    },
    optionCaller: {
      type: Function,
    },
    callerParams: {
      type: Object,
      default: function () {
        return {};
      },
    },
    defaultName: {
      type: String,
      default: 'Seleccione o Busque',
    },
    options: {
      type: Array,
      default: function () {
        return [];
      },
    },
    modelValue: {},
  },
  mounted() {
    console.log('++++++++++++++++++++++++');
    console.log(this.options);
    console.log(this.value);
    if (this.withCaller) {
      console.log('Retrieving options');
      this.retrieveOptions();
    }
  },
  computed: {
    filteredOptions() {
      return this.options.filter((o) => this.isSimilar(o));
    },
    searchId() {
      return `search-${this.dropdownId}`;
    },
    finalDropdownId() {
      return `dropdown-${this.dropdownId}`;
    },
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    reCall() {
      this.maintain = this.searchValue;
      this.$emit('reCall', this.searchValue);
    },
    selected(option) {
      this.value = option;
      console.log('Selected', option);
    },
    retrieveOptions() {
      this.optionCaller(this.callerParams).then((response) => {
        console.log(response);
        this.localOptions = response.data;
      });
    },
    isSimilar(option) {
      return option[this.optionName].toLowerCase().includes(this.searchValue.toLowerCase());
    },
    focusSearch() {
      document.getElementById(this.searchId).focus();
    },
  },
};
</script>

<style scoped>
.textError {
  text-align: left !important;
  color: red;
  font-size: 14px;
}
</style>
