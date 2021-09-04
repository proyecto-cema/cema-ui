<template>
  <div class="row d-flex align-items-center">
    <div class="offset-lg-2 col-12 col-lg-8">
      <div class="card">
        <div class="card-header bg-dark text-white text-center" >
          <h3>{{ edit ? "Editar Establecimiento" : "Registrar Establecimiento" }}</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="">
            <div class="row ms-2 me-2">
              <div class="mb-3 col-12 col-md-6">
                <label for="establishmentName" class="form-label">Nombre<small style="color: red">*</small></label>
                <input
                    id="establishmentName"
                    v-model.trim="establishment.name"
                    :class="[errorSave.name ? 'is-invalid' : '']"
                    class="form-control"
                    placeholder="Nombre" required type="text">
                <div v-if="errorSave.name" class="textError">
                  <span class="is-invalid"></span> Ingrese el nombre del establecimiento
                </div>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <label for="establishmentCUIG" class="form-label">CUIG<small style="color: red">*</small></label>
                <input
                    id="establishmentCUIG"
                    v-model.trim="establishment.cuig"
                    :readonly="edit"
                    :class="[errorSave.cuig ? 'is-invalid' : '']"
                    class="form-control"
                    placeholder="CUIG" required type="text">
                <div v-if="errorSave.cuig" class="textError">
                  <span class="is-invalid"></span> Ingrese el CUIG del establecimiento
                </div>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <label for="establishmentLocation" class="form-label">Ubicación</label>
                <input
                    id="establishmentLocation"
                    v-model.trim="establishment.location"
                    class="form-control"
                    placeholder="Ubicación" type="text">
              </div>
              <div class="mb-3 col-12 col-md-6">
                <label for="establishmentPhone" class="form-label">Teléfono</label>
                <input
                    id="establishmentPhone"
                    v-model.trim="establishment.phone"
                    class="form-control"
                    placeholder="Teléfono" type="text">
              </div>
              <div class="mb-3 col-12 col-md-6">
                <label for="establishmentEmail" class="form-label">Correo Electrónico</label>
                <input
                    id="establishmentEmail"
                    v-model.trim="establishment.email"
                    class="form-control"
                    placeholder="Correo Electrónico" type="email">
              </div>
              <div class="mb-3 col-12 col-md-6">
                <label for="establishmentOwner" class="form-label">Propietario<small style="color: red">*</small></label>
                <select
                    id="establishmentOwner"
                    v-model="establishment.ownerUserName"
                    :class="[errorSave.owner ? 'is-invalid' : '']"
                    class="form-select" required>
                  <option selected="selected" value="">Seleccionar</option>
                  <option v-for="owner in owners" :value="owner.userName" :key="owner.userName">{{owner.name+" "+owner.lastName }}</option>
                </select>
                <div v-if="errorSave.owner" class="textError">
                  <span class="is-invalid"></span> Seleccione el propietario
                </div>
              </div>
            </div>
            <div class="col-12">
              <div v-if="error.type !== null" class="ms-3 me-3">
                <div class="alert alert-danger alert-dismissible">
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
                <button class="btn btn-primary text-white"
                        type="button" v-on:click="preSave()">
                  Guardar
                </button>
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
      confirmation-message="¿Confirma que desea guardar los datos del establecimineto?"
      modal-id="SaveModal" title="Guardar" @acceptModal="formSaveEstablishment()"></confirmation-modal>
  <confirmation-modal
      confirmation-message="¿Confirma que desea eliminar Establecimiento?"
      modal-id="DeleteModal" title="Eliminar" @acceptModal="formDeleteEstablishment()"></confirmation-modal>
  <confirmation-modal
      confirmation-message="El establecimiento buscado no se encuentra, ¿desea crear uno nuevo o volver al inicio?"
      modal-id="SearchModal" title="Establecimiento no encontrado"
      btn-accept="Nuevo" btn-reject="Inicio"
      @acceptModal="this.startNewWithCuig()"
      @rejectModal="this.$router.back()"
  ></confirmation-modal>
</template>
<script>
import {mapActions, mapState} from "vuex";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Modal } from 'bootstrap';


export default {
  name: "AddEstablishment",
  data() {
    return {
      success: null,
      edit: false,
      owners:[],
      errorSave: {
        name: false,
        cuig: false,
        owner: false
      },

    };
  },
  components:{
    ConfirmationModal
  },
  mounted() {
    this.searchOwners()
    this.cuig = this.$route.query.cuig;
    console.log("Owners:"+ this.owners);
    this.edit = !!this.cuig;
    
    if (this.edit){
      this.formRetrieveEstablishment()
    }else{
      this.clearEstablishmentData();
    }
  },
  computed: {
    ...mapState("establishment", ["establishment", "error"]),
    
  },
  methods: {
    ...mapActions("establishment", ["getEstablishment", "saveEstablishment", "deleteEstablishment", "clearEstablishmentData","listOwners"]),

    startNewWithCuig(){
      this.clearEstablishmentData();
      this.edit = false;
      this.establishment.cuig = this.cuig;
    },
    successCall(message) {
      this.success = message;
      this.edit = false;
      this.clearEstablishmentData();
    },
    async preSave(){
      this.errorSave = {};
      this.success = null;
      this.errorSave = {
        name: (!this.establishment.name),
        cuig: (!this.establishment.cuig),
        owner: (!this.establishment.owner)
      }
      if (this.errorSave.name || this.errorSave.cuig || this.errorSave.owner) {
        console.error(this.errorSave)
        return
      }
      let modal = new Modal(document.getElementById('SaveModal'));
      modal.show()
    },
    async formSaveEstablishment() {
      let data = {
        edit: this.edit,
        establishment: this.establishment
      };
      this.saveEstablishment(data).then(
        () => {
          this.successCall("El Establecimiento se guardó correctamente");
        }
      );
    },
    async formRetrieveEstablishment() {
      this.errorSave = {};
      this.success = null;
      this.getEstablishment(this.cuig).then(
        () => {},
        (error) => {
          let modal = new Modal(document.getElementById('SearchModal'));
          modal.show()
          this.edit = false;
        }
      )
    },
    async formDeleteEstablishment() {
      this.errorSave = {};
      this.success = null;
      this.deleteEstablishment(this.cuig).then(
        () => {
          this.successCall("El Establecimiento se elimino correctamente");
        }
      );
    },
    async searchOwners() {
      this.listOwners().then(
          (response) => {
            this.owners = response.data;
            console.log(response);
          }
      )
    }
  },
};

</script>
<style>
.textError {
  text-align: left !important;
  color: red;
  font-size: 14px;
}
</style>