<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId+'Label'" class="modal-title">{{ edit ? "Editar Bovino" : "Registrar Bovino" }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-lg-4 col-12">
                <div class="position-relative text-center">
                  <img alt="Identificador" class="imageIdBovine" src="../../assets/images/Bovine/tag_bovino.png"/>
                  <div class="TextCenterImage"><h4>{{ bovine.establishmentCuig }}<br>{{ bovine.tag }}</h4></div>
                </div>
              </div>
              <div class="col-lg-7 col-12">
                <div class="row">
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="bovine.tag" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.tag,
                                    errorMessage: 'Ingrese el número de caravana del bovino'}"
                                input-title="Caravana" input-id="bovineTag" type="text" :disabled="edit"></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model="bovine.taggingDate" :max="getToday" required
                                :error-data="{required: true, errorStatus: errorSave.taggingDate,
                                    errorMessage: 'Ingrese la fecha del caravaneo'}"
                                input-title="Fecha de caravaneo" input-id="bovineDate" type="date"></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model="bovine.genre" component-type="select" required
                                :error-data="{required: true, errorStatus: errorSave.genre,
                                    errorMessage: 'Seleccione el sexo del bovino'}"
                                input-title="Sexo" input-id="bovineGenre"
                                :options="['Macho', 'Hembra']"></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <label class="form-label" for="bovineDescription">Descripción</label>
                    <textarea
                        id="bovineDescription" v-model.trim="bovine.description"
                        class="form-control" maxlength="300"
                        placeholder="Descripción" rows="4" type="text"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="col-12 text-center">
                <div v-if="error.type !== null" class="alert alert-danger alert-dismissible">
                  {{ error.message }}
                </div>
                <div v-if="success !== null" class="alert alert-success alert-dismissible">
                  {{ success }}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-dark text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="clean()">
            Cancelar
          </button>
          <button v-if=edit class="btn btn-dark text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="deleteModal()">
            Eliminar
          </button>
          <button class="btn btn-primary text-white" :disabled="!bovine.tag"
                  type="button" v-on:click="saveModal()">
            {{ edit ? "Modificar":"Guardar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from "../CemaInput";
import {mapActions, mapState} from "vuex";

export default {
  name: "BovineModal",
  data(){
    return {
      success: null,
      errorSave: {
        tag: false,
        taggingDate: false,
        genre: false
      },
    };
  },
  components: { CemaInput },
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState("bovine", ["bovine", "error", "edit"]),
    getToday(){
      return this.getMomentToday()
    }
  },
  methods: {
    ...mapActions("bovine", ["getBovine", "saveBovine", "dismissError", "setupEditBovine"]),
    clean(){
      this.errorSave = {};
      this.success = null;
      this.dismissError();
    },
    successCall(message) {
      this.success = message;
      this.dismissError();
    },
    deleteModal() {
      this.$emit('deleteModal', this.bovine.tag);
      this.clean();
    },
    saveModal() {
      this.errorSave = {
        tag: (!this.bovine.tag),
        taggingDate: (!this.bovine.taggingDate),
        genre: (!this.bovine.genre)
      }
      if (this.errorSave.taggingDate || this.errorSave.tag || this.errorSave.genre) {
        console.error(this.errorSave)
        return
      }
      this.formSaveBovine()
    },
    async formSaveBovine() {
      let data = {
        edit: this.edit,
        bovine: this.bovine
      };
      this.saveBovine(data).then(
          (bovine) => {
            this.successCall("El Bovino se guardó correctamente");
            this.setupEditBovine(bovine);
          }
      );
    },
  }
}
</script>

<style scoped>
.TextCenterImage {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.imageIdBovine {
  width: 60% !important;
}
</style>