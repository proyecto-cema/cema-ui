
<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5  class="modal-title">{{ edit ? "Editar Ubicación" : "Registrar Ubicación" }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="locationData.name" required maxlength="50"
                                :error-data="{required: true, errorStatus: errorSave.name,
                                    errorMessage: 'Ingrese el nombre de la ubicación'}"
                                input-title="Nombre" input-id="locationName" type="text"></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model="locationData.size" :error-data="{required: true, errorStatus: errorSave.size,
                                errorMessage: 'Ingrese un número válido'}"
                                input-title="Tamaño" input-id="locationSize" type="number" min="0"></cema-input>
                  </div>
                  <div class="col-12 mb-3">
                    <cema-input v-model.trim="locationData.description" component-type="textarea" maxlength="250"
                                input-title="Descripción" input-id="locationDescription" type="text"
                    ></cema-input>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="clean()">
            Cancelar
          </button>
          <button v-if="edit" class="btn btn-primary text-white"
                  type="button" v-on:click="clean()">
            Crear Nuevo
          </button>
          <button v-if="edit" class="btn btn-danger text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="deleteLocation()">
            Eliminar
          </button>
          <button class="btn btn-secondary text-white" :disabled="!locationData.name"
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

export default {
  name: "LocationModal",
  emits: ['deleteModal', 'createdNew'],
  data(){
    return {
      errorSave: {
        name: null,
      },
    };
  },
  components: { CemaInput },
  computed: {
    ...mapState("location", ["locationData", "edit"]),
    errorSaveHelper(){
      return {
        name: !this.locationData.name,
        size: this.locationData.size<0,
      }
    }
  },
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.setCuigToDefault();
  },
  methods: {
    ...mapActions("location", ["clearLocationData", "saveLocation", "setupEditLocation"]),
    ...mapActions("bovine", ["setCuigToDefault"]),
    ...mapActions(["showSuccess"]),
    clean(){
      this.errorSave = {};
      this.clearLocationData();
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave)
        return
      }
      this.commitSave()
    },
    deleteLocation(){
      this.$emit('deleteModal', this.locationData.name);
      this.clean();
    },
    async commitSave() {
      let editing = this.edit;
      this.saveLocation().then(
          (response) => {
            this.showSuccess(`La ubicación ${this.locationData.name} se guardó correctamente`);
            this.setupEditLocation(this.locationData);
            this.$emit('createdNew', { location: this.locationData, edit: editing });
          }
      );
    }
  }
}
</script>

<style scoped>
</style>