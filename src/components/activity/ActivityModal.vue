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
                  <cema-input v-model="activity.name" required input-title="Nombre" :options="bovines"
                              input-id="name" type="text"  :error-data="{required: true,
                              errorStatus: errorSave.activityName, errorMessage: 'Ingrese el nombre de la actividad'}">
                  </cema-input>
                </div>
                <div class="col-12 mb-3">
                  <cema-input v-model="activity.type" component-type="select" required
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
                  <cema-input v-model="activity.executionDate" :max="getToday"
                              input-title="Fecha de la Actividad" input-id="executionDate" type="date">
                  </cema-input>
                </div>
              </div>
              <div class="col-lg-6 col-12">
                <div class="col-12 mb-3">
                  <cema-input v-model.trim="activity.description" maxlength="300"
                              component-type="textarea"
                              input-title="Observaciones" input-id="vaccineDescription" type="text"
                              rows="8">
                  </cema-input>
                </div>
              </div>
              <div class="col-12" v-if="activity.type">
                <hr>
                <slot></slot>
              </div>
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
import {mapActions, mapState} from "vuex";
import {ACTIVITIES_OPTIONS} from "../../constants";

export default {
  name: "ActivityModal",
  data(){
    return {
      errorSave: {
        activityType: false,
        activityName: false
      },
      activitiesOptions: ACTIVITIES_OPTIONS,
    };
  },
  components: {CemaInput},
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.setCuigToDefault();
  },
  computed: {
    ...mapState("activity", ["edit", "activity"]),
    modalTitle(){
      let name = this.activity.type ? this.activity.type : 'Actividad';
      return this.edit ? `Editar ${name}` : `Registrar ${name}`
    },
    getToday(){
      return this.getMomentToday()
    },
    errorSaveHelper(){
      return {
        activityName: !this.activity.name,
        activityType: !this.activity.type
      }
    }
  },
  methods: {
    ...mapActions("activity", ["saveActivity", "deleteActivity", "clearActivityData"]),
    ...mapActions("bovine", ["setCuigToDefault"]),
    ...mapActions(["showSuccess"]),
    clean(){
      this.errorSave ={
        activityType: false,
        activityName: false
      };
      this.clearActivityData()
    },
    successCall(message) {
      this.showSuccess(message);
    },
    deleteModal() {
      this.deleteActivity({uuid: this.activity.uuid}).then(
          () => {
            this.successCall(`La actividad de ${this.activity.type} fue eliminada correctamente`);
          }
      );
    },
    saveModal() {
      if (this.errorSaveHelper.activityType || this.errorSaveHelper.activityType) {
        console.error(this.errorSave)
        return
      }
      this.formSaveActivity()
    },
    async formSaveActivity() {
      this.saveActivity().then(
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