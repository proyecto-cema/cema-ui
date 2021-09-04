<template>
  <div class="row text-center d-flex align-items-center full-width">
    <div class="offset-lg-2 col-12 col-lg-8">
      <div class="card">
        <div class="card-header bg-dark text-white">
          <h3>{{ edit ? "Editar Bovino" : "Registrar Bovino" }}</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-lg-4 col-sm-12">
                <div class="contenedor">
                  <img alt="Identificador" class="imageIdBovine" src="../../assets/images/Bovine/tag_bovino.png"/>
                  <div class="TextCenterImage"><h4>{{ bovine.establishmentCuig }}<br>{{ bovine.tag }}</h4></div>
                </div>
              </div>
              <div class="col-lg-7 col-sm-12">
                <div class="row">
                  <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                    <div class="textLeft"><label>Caravana<small style="color: red">*</small></label></div>
                    <input
                        v-model.trim="bovine.tag"
                        :class="[errorSave.tag ? 'is-invalid' : '']"
                        :readonly="edit"
                        class="form-control marginButton"
                        maxlength="10" placeholder="Caravana" required
                        type="text"
                    >
                    <div v-if="errorSave.tag" class="textError">
                      <span :class="is-invalid"></span> Ingrese el número de caravana del bovino
                    </div>
                  </div>
                  <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                    <div class="textLeft"><label>Fecha de caravaneo<small style="color: red">*</small></label></div>
                    <input
                        v-model.trim="bovine.taggingDate"
                        :class="[errorSave.taggingDate  ? 'is-invalid' : '']"
                        class="form-control marginButton"
                        placeholder="Fecha" required
                        type="date" :max="getToday"
                    >
                    <div v-if="errorSave.taggingDate" class="textError">
                      <span class="is-invalid"></span> Ingrese la fecha del caravaneo
                    </div>
                  </div>
                  <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                    <div class="textLeft"><label>Sexo<small style="color: red">*</small></label></div>
                    <select id="sexo" v-model="bovine.genre" :class="[errorSave.genre ? 'is-invalid' : '']"
                            class="form-control invalid-arrow marginButton" required>
                      <option selected="selected" value="">Seleccionar</option>
                      <option selected value="Macho">Macho</option>
                      <option selected value="Hembra">Hembra</option>
                    </select>
                    <div v-if="errorSave.genre" class="textError">
                      <span class="is-invalid"></span> Seleccione el sexo del bovino
                    </div>
                  </div>
                  <div class="col-lg-12 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                    <div class="textLeft"><label>Descripción</label></div>
                    <textarea
                        v-model.trim="bovine.description"
                        class="form-control marginButton"
                        maxlength="300"
                        placeholder="Descripción"
                        required rows="4" type="text"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="col-lg-10 offset-lg-1 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                  <div v-if="error.type !== null" class="alert alert-danger alert-dismissible">
                    {{ error.message }}
                  </div>
                  <div v-if="success !== null" class="alert alert-success alert-dismissible">
                    {{ success }}
                  </div>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button class="btn btn-dark text-white" data-bs-target="#CancelModal" data-bs-toggle="modal"
                          type="button">
                    Cancelar
                  </button>
                  <button v-if=(this.edit) class="btn btn-danger text-white" data-bs-target="#DeleteModal" data-bs-toggle="modal"
                          type="button">
                    Eliminar
                  </button>
                  <button class="btn btn-primary text-white" :disabled="!this.bovine.tag"
                          type="button" v-on:click="preSave()">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <confirmation-modal
      confirmation-message="¿Está seguro que desea cancelar la acción en curso?
       Se cerrará la ventana y se perderán todos los cambios."
      modal-id="CancelModal" title="Cancelar" @acceptModal="this.$router.back()"></confirmation-modal>
  <confirmation-modal
      :confirmation-message="'¿Confirma que desea guardar los datos del bovino con caravana ' + this.bovine.tag + '?'"
      modal-id="SaveModal" title="Guardar" @acceptModal="formSaveBovine()"></confirmation-modal>
  <confirmation-modal
      :confirmation-message="'¿Confirma que desea eliminar bovino ' + this.bovine.tag + '?'"
      modal-id="DeleteModal" title="Eliminar" @acceptModal="formDeleteBovine()"></confirmation-modal>
  <confirmation-modal
      :confirmation-message="'El bovino con caravana ' + this.bovine.tag + ' no se encuentra, ' +
       '¿desea crear uno nuevo o volver al inicio?'"
      modal-id="SearchModal" title="Bovino no encontrado"
      btn-accept="Nuevo" btn-reject="Inicio"
      @acceptModal="this.startNewWithTag()"
      @rejectModal="this.$router.back()"
  ></confirmation-modal>
</template>
<script>
import {mapActions, mapState} from "vuex";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Modal } from 'bootstrap'
import moment from "moment";


export default {
  name: "AddBovine",
  data() {
    return {
      success: null,
      edit: false,
      errorSave: {
        tag: false,
        taggingDate: false,
        genre: false
      },

    };
  },
  components:{
    ConfirmationModal
  },
  mounted() {
    this.tag = this.$route.query.tag;
    console.log(this.tag);
    this.edit = !(this.tag == null || this.tag === "");
    console.log(this.edit)
    if (this.edit){
      this.formRetrieveBovine()
    }else{
      this.clearBovineData();
      this.bovine.establishmentCuig = this.$store.state.auth.user.user.establishmentCuig;
    }
  },
  computed: {
    ...mapState("bovine", ["bovine", "error"]),
    getToday(){
      return moment().format("YYYY-MM-DD")
    }
  },
  methods: {
    ...mapActions("bovine", ["getBovine", "saveBovine", "deleteBovine", "clearBovineData"]),
    startNewWithTag(){
      this.clearBovineData();
      this.edit = false;
      this.bovine.tag = this.tag;
    },
    successCall(message) {
      this.success = message;
      this.edit = false;
      this.clearBovineData();
    },
    async preSave(){
      this.errorSave = {};
      this.success = null;
      this.errorSave = {
        tag: (!this.bovine.tag),
        taggingDate: (!this.bovine.taggingDate),
        genre: (!this.bovine.genre)
      }
      if (this.errorSave.taggingDate || this.errorSave.tag || this.errorSave.genre) {
        console.error(this.errorSave)
        return
      }
      let modal = new Modal(document.getElementById('SaveModal'));
      modal.show()
    },
    async formSaveBovine() {
      let data = {
        edit: this.edit,
        bovine: this.bovine
      };
      this.saveBovine(data).then(
        () => {
          this.successCall("El Bovino se guardó correctamente");
          if (data["edit"]) {
            this.$router.back();
          }
        }
      );
    },
    async formRetrieveBovine() {
      this.errorSave = {};
      this.success = null;
      this.getBovine(this.tag).then(
        () => {},
        (error) => {
          let modal = new Modal(document.getElementById('SearchModal'));
          modal.show()
          this.edit = false;
        }
      )
    },
    async formDeleteBovine() {
      this.errorSave = {};
      this.success = null;
      this.deleteBovine(this.tag).then(
        () => {
          this.successCall("El Bovino se elimino correctamente");
        }
      );
    }
  },
};

</script>
<style>
.TextCenterImage {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.imageIdBovine {
  width: 60% !important;
}

.textLeft {
  text-align: left !important;
}

.marginSeccion {
  margin-bottom: 8px;
}

.contenedor {
  position: relative;
  display: inline-block;
  text-align: center;
}

.textError {
  text-align: left !important;
  color: red;
  font-size: 14px;
}
</style>