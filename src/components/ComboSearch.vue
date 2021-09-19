<template>
  <div class="dropdown">
    <button class="form-select text-start" type="button" :id=finalDropdownId
            data-bs-toggle="dropdown" data-bs-auto-close="outside" v-on:click="focusSearch()"
            aria-expanded="false">
      {{ optionSelected }}
    </button>
    <ul class="dropdown-menu w-100" :aria-labelledby=finalDropdownId>
      <li class="input-group">
        <input class="form-control" :id=searchId type="text" autocomplete="off" v-model="search">
        <button class="btn" type="button" @click.prevent="search=''"><font-awesome-icon icon="times"></font-awesome-icon></button>
      </li>
      <template v-for="option in options">
        <li v-if="isSimilar(option)">
          <button class="dropdown-item" type="button" v-on:click="selected(option)">{{ option[optionName] }}</button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return {
      search: "",
      options: [],
      optionSelected: "Default dropdown"
    };
  },
  name: "ComboSearch",
  props: {
    dropdownId:{
      type: String,
      required: true
    },
    optionName: {
      type: String,
      required: true
    },
    optionCaller: {
      type: Function,
      required: true
    },
    callerParams: {
      type: Object,
      default: {}
    },
    defaultName: {
      type: String,
      default: "Seleccione o Busque"
    }
  },
  mounted() {
    this.optionSelected = this.defaultName;
    this.retrieveOptions();
  },
  computed:{
    searchId(){
      return `search-${this.dropdownId}`
    },
    finalDropdownId(){
      return `dropdown-${this.dropdownId}`
    }
  },
  methods: {
    selected(option){
      this.optionSelected = option[this.optionName];
    },
    retrieveOptions(){
      this.optionCaller(this.callerParams).then(
          (response) => {
            console.log(response);
            this.options = response.data;
          }
      );
    },
    isSimilar(option){
      return option[this.optionName].toLowerCase().includes(this.search.toLowerCase());
    },
    focusSearch(){
      document.getElementById(this.searchId).focus();
    }
  }
}
</script>
