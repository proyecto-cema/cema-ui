<template>
  <div class="row text-center">
    <div class="offset-lg-2 col-12 col-lg-8">
      <form class="borderDiv" style="border-radius: 10px;margin-top:100px; background: #ffffff;"
            @submit.prevent="">
        <div style="background-color:black;padding-bottom: 1px;margin-bottom: 5px;">
          <h3 style="color:white">{{ edit ? "Editar Bovino" : "Registrar Bovino" }}</h3>
        </div>
        <div class="row">
          <div class="col-lg-4 col-sm-12">
            <div class="contenedor">
              <img alt="Identificador" class="imageIdBovine" src="../../assets/images/Bovine/tag_bovino.png"/>
              <div class="TextCenterImage"><h4>{{ bovine.tag }}</h4></div>
            </div>
          </div>
          <div class="col-lg-7 col-sm-12">
            <div class="row">
              <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                <div class="textLeft"><label>Caravana</label></div>
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
                <div class="textLeft"><label>Fecha de caravaneo</label></div>
                <input
                    v-model.trim="bovine.taggingDate"
                    :class="[errorSave.taggingDate  ? 'is-invalid' : '']"
                    class="form-control marginButton"
                    placeholder="Fecha" required
                    type="date"
                >
                <div v-if="errorSave.taggingDate" class="textError">
                  <span class="is-invalid"></span> Ingrese la fecha del caravaneo
                </div>
              </div>
              <div class="col-lg-6 offset-lg-0 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
                <div class="textLeft"><label>Sexo</label></div>
                <select id="sexo" v-model="bovine.genre" :class="[errorSave.genre ? 'is-invalid' : '']"
                        class="form-control invalid-arrow marginButton" required>
                  <option selected="selected" value="">Seleccionar</option>
                  <option selected value="Masculino">Masculino</option>
                  <option selected value="Femenino">Femenino</option>
                </select>
                <div v-if="errorSave.genre" class="textError">
                  <span class="is-invalid"></span> Seleccione el género del bovino
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
            <div class="row">
              <div class="col-lg-2 col-sm-4 col-4"
                   v-bind:class="this.edit?'offset-lg-6':'offset-lg-8 offset-sm-4 offset-4'">
                <button class="btn btn-dark text-white button-margin" data-bs-target="#CancelModal" data-bs-toggle="modal"
                        type="button">
                  Cancelar
                </button>
              </div>
              <div v-if=(this.edit) class="col-lg-2 col-sm-4 col-4">
                <div>
                  <button class="btn btn-danger text-white button-margin" data-bs-target="#DeleteModal" data-bs-toggle="modal"
                          type="button">
                    Eliminar
                  </button>
                </div>
              </div>
              <div class="col-lg-2 col-sm-4 col-4">
                <button class="btn btn-primary text-white button-margin" data-bs-target="#SaveModal" data-bs-toggle="modal"
                        type="button">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>

  <confirmation-modal
      confirmation-message="¿Está seguro que desea cancelar la acción en curso?
       Se cerrará la ventana y se perderán todos los cambios."
      modal-id="CancelModal" title="Cancelar" @acceptModal="this.$router.push('/')"></confirmation-modal>
  <confirmation-modal
      confirmation-message="¿Confirma que desea guardar los datos del bovino?"
      modal-id="SaveModal" title="Guardar" @acceptModal="formSaveBovine()"></confirmation-modal>
  <confirmation-modal
      confirmation-message="¿Confirma que desea eliminar bovino?"
      modal-id="DeleteModal" title="Eliminar" @acceptModal="formDeleteBovine()"></confirmation-modal>
  <confirmation-modal
      confirmation-message="El bovino buscado no se encuentra, ¿desea crear uno nuevo o volver al inicio?"
      modal-id="SearchModal" title="Bovino no encontrado"
      btn-accept="Nuevo" btn-reject="Inicio"
      @acceptModal="this.$router.push('/bovinos/formulario')"
      @rejectModal="this.$router.push('/')"
  ></confirmation-modal>
</template>
<script>
import {mapActions, mapState} from "vuex";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Modal } from 'bootstrap'


export default {
  name: "AddBovine",
  data() {
    return {
      showModal: false,
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
    }
  },
  computed: {
    ...mapState("bovine", ["bovine", "error"]),
  },
  methods: {
    ...mapActions("bovine", ["getBovine", "saveBovine", "deleteBovine", "clearBovineData"]),

    successCall(message) {
      this.success = message;
      this.edit = false;
      this.clearBovineData();
    },
    async formSaveBovine() {
      this.showModal = true
      this.errorSave = {};
      this.success = null;
      this.errorSave = {
        tag: (this.bovine.tag == null || this.bovine.tag === ""),
        taggingDate: (this.bovine.taggingDate == null || this.bovine.taggingDate === ""),
        genre: (this.bovine.genre == null || this.bovine.genre === "")
      }
      if (this.errorSave.taggingDate || this.errorSave.tag || this.errorSave.genre) {
        console.error(this.errorSave)
        return
      }
      let data = {
        edit: this.edit,
        bovine: this.bovine
      };
      this.saveBovine(data).then(
        () => {
          this.successCall("El Bovino se guardó correctamente");
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

.marginButton {
  margin-top: 0 !important;
}

.marginSeccion {
  margin-bottom: 8px;
}

.borderDiv {
  border: solid;
  padding-left: 0;
  padding-right: 0;
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