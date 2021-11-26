<template>
  <label v-if="label" :for="inputId" class="form-label"
    >{{ inputTitle }}<small v-if="errorData.required" style="color: red">*</small></label
  >
  <input
    v-if="componentType === 'input'"
    :id="inputId"
    v-model="value"
    :class="[errorData.required && errorData.errorStatus ? 'is-invalid' : '']"
    class="form-control"
    v-bind="$attrs"
    :placeholder="inputTitle"
  />
  <select
    v-if="componentType === 'select'"
    :id="inputId"
    v-model="value"
    :class="[errorData.required && errorData.errorStatus ? 'is-invalid' : '']"
    class="form-select"
    v-bind="$attrs"
  >
    <option selected value="" hidden>{{ selectedOption ? selectedOption : inputTitle }}</option>
    <option
      v-for="option in options"
      :value="optionKey ? option[optionKey] : option"
      :key="optionKey ? option[optionKey] : option"
    >
      <slot :option="option">{{ option }}</slot>
    </option>
    <slot name="extraOptions"></slot>
  </select>
  <textarea
    v-if="componentType === 'textarea'"
    :id="inputId"
    v-model="value"
    :class="[errorData.required && errorData.errorStatus ? 'is-invalid' : '']"
    class="form-control"
    v-bind="$attrs"
    :placeholder="inputTitle"
  >
  </textarea>
  <div v-if="errorData.required && errorData.errorStatus" class="textError">
    <span class="is-invalid"></span> {{ errorData.errorMessage }}
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'RequiredInput',
  emits: ['update:modelValue'],
  props: {
    componentType: {
      type: String,
      default: 'input',
    },
    label: {
      type: Boolean,
      default: true,
    },
    inputId: {
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
    optionKey: {
      type: String,
      default: null,
    },
    selectedOption: {
      type: String,
      required: false,
    },
    options: {},
    modelValue: {},
  },
  mounted() {
    if (this.componentType === 'select' && !this.value) {
      this.value = '';
    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
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
