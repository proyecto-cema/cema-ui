<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId+'Label'" class="modal-title">{{ modalTitle }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-lg-6 col-12">
                <div class="col-12 mb-3">
                  <cema-input v-model="activityData.name" required input-title="Nombre"
                              input-id="name" type="text"  :error-data="{required: true,
                              errorStatus: errorSave.activityName, errorMessage: 'Ingrese el nombre de la actividad'}">
                  </cema-input>
                </div>
                <div class="col-12 mb-3">
                  <cema-input v-model="activityData.type" component-type="select" required
                              :error-data="{required: true, errorStatus: errorSave.activityType,
                                errorMessage: 'Seleccione el tipo de actividad'}"
                              input-title="Tipo de Actividad" input-id="activityType"
                              :options="activitiesOptions" optionKey="backendName">
                    <template v-slot:default="{ option }">
                      {{ option.displayName }}
                    </template>
                  </cema-input>
                </div>
                <div class="col-12 mb-3">
                  <cema-input v-model="activityData.executionDate" :max="getToday"
                              input-title="Fecha de la Actividad" input-id="executionDate" type="date">
                  </cema-input>
                </div>
              </div>
              <div class="col-lg-6 col-12">
                <div class="col-12 mb-3">
                  <cema-input v-model.trim="activityData.description" maxlength="300"
                              component-type="textarea"
                              input-title="Observaciones" input-id="vaccineDescription" type="text"
                              rows="8">
                  </cema-input>
                </div>
              </div>
              <template v-if="activityData.type">
                <component v-bind:is="selectedActivityComponent" :error-save="errorSave"></component>
              </template>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="clean()">
            Cancelar
          </button>
          <button v-if=edit class="btn btn-primary text-white"
                  type="button" v-on:click="clean()">
            Crear Nuevo
          </button>
          <button v-if=edit class="btn btn-danger text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="deleteModal()">
            Eliminar
          </button>
          <button class="btn btn-secondary text-white"
                  type="button" v-on:click="saveModal()">
            {{ edit ? "Modificar":"Guardar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from "../form/CemaInput";
import VaccinationForm from "../../components/activity/VaccinationForm";
import WeighingForm from "../../components/activity/WeighingForm";
import {mapActions, mapState} from "vuex";
import {ACTIVITIES_EXTRA_DATA, ACTIVITIES_OPTIONS, SEARCH_DEFAULT_TAG} from "../../constants";

export default {
  name: "ActivityModal",
  data(){
    return {
      errorSave: {},
      activitiesOptions: ACTIVITIES_OPTIONS,
    };
  },
  components: { CemaInput, VaccinationForm, WeighingForm },
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.setCuigToDefault();
    this.activityData.executionDate = this.getToday;
  },
  computed: {
    ...mapState("activity", ["edit", "activityData"]),
    getToday(){
      return this.getMomentToday()
    },
    activityMap(){
      return ACTIVITIES_EXTRA_DATA[this.activityData.type];
    },
    selectedActivityComponent(){
      return this.activityMap.componentName;
    },
    modalTitle(){
      let name = this.activityData.type ? this.activityMap["displayName"] : 'Actividad';
      return this.edit ? `Editar ${name}` : `Registrar ${name}`
    }
  },
  methods: {
    ...mapActions("activity", ["saveActivity", "deleteActivity", "clearActivityData"]),
    ...mapActions("bovine", ["setCuigToDefault"]),
    ...mapActions(["showSuccess"]),
    validate(){
      this.errorSave["activityName"] = !this.activityData.name;
      this.errorSave["activityType"] = !this.activityData.type;
      if (this.activityData.extraData.isBatch){
        this.errorSave["bovineBatch"] = !this.activityData.extraData.batchName;
      }else {
        this.errorSave["bovineTag"] = this.activityData.extraData.bovineTag === SEARCH_DEFAULT_TAG || !this.activityData.extraData.bovineTag;
      }
      let validations = this.activityMap.validations;
      for (const key in validations){
        this.errorSave[key] = !this.activityData.extraData[validations[key]];
      }
    },
    hasErrors(){
      for(let errorKey in this.errorSave){
        if(this.errorSave[errorKey]){
          return true;
        }
      }
      return false;
    },
    clean(){
      this.errorSave = {};
      this.clearActivityData()
    },
    successCall(message) {
      this.showSuccess(message);
    },
    deleteModal() {
      this.deleteActivity({id: this.activityData.id, url: this.activityMap.url}).then(
          () => {
            this.successCall(`La actividad de ${this.activityData.type} fue eliminada correctamente`);
          }
      );
    },
    saveModal() {
      this.validate()
      if (this.hasErrors()) {
        console.error(this.errorSave)
        return
      }
      this.formSaveActivity()
    },
    async formSaveActivity() {
      this.saveActivity(this.activityMap.url).then(
          (activity) => {
            this.successCall(`Se guardó la actividad de ${activity.type} con nombre ${activity.name}`);
          }
      );
    },
  }
}
</script>

<style scoped>

</style>