<template>
  <div class="row d-flex align-items-center">
    <div class="offset-lg-2 col-12 col-lg-8">
      <div class="card">
        <div class="card-header bg-primary text-white text-center" >
          <h3>{{ edit ? "Editar Establecimiento" : "Registrar Establecimiento" }}</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="">
            <div class="row ms-2 me-2">
              <div class="mb-3 col-12 col-md-6">
                <cema-input v-model.trim="establishment.name" required
                            :error-data="{required: true, errorStatus: errorSave.name,
                                    errorMessage: 'Ingrese el nombre del establecimiento'}"
                            input-title="Nombre" input-id="establishmentName" type="text"></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input v-model.trim="establishment.cuig" required :readonly="edit"
                            :error-data="{required: true, errorStatus: errorSave.cuig,
                                    errorMessage: 'Ingrese el CUIG del establecimiento'}"
                            input-title="CUIG" input-id="establishmentCUIG" type="text"></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input v-model.trim="establishment.location" type="text"
                            input-title="Ubicación" input-id="establishmentLocation"></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input v-model.trim="establishment.phone" type="text"
                            input-title="Teléfono" input-id="establishmentPhone"></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input v-model.trim="establishment.email" type="email"
                            input-title="Correo Electrónico" input-id="establishmentEmail"></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input v-model="establishment.ownerUserName" component-type="select" required
                            :error-data="{required: true, errorStatus: errorSave.owner,
                                    errorMessage: 'Seleccione el propietario'}"
                            input-title="Propietario" input-id="establishmentOwner"
                            :options="owners" optionKey="userName" v-slot="{ option }">
                  {{ option.name+" "+option.lastName }}
                </cema-input>
              </div>
            </div>
            <div class="col-12">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button class="btn btn-primary text-white" data-bs-target="#CancelModal" data-bs-toggle="modal"
                        type="button">
                  Cancelar
                </button>
                <button v-if=(this.edit) class="btn btn-danger text-white" data-bs-target="#DeleteModal" data-bs-toggle="modal"
                        type="button">
                  Eliminar
                </button>
                <button class="btn btn-secondary text-white"
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
import { Modal, Toast } from 'bootstrap';
import CemaInput from "../../components/CemaInput";


export default {
  name: "AddEstablishment",
  data() {
    return {
      edit: false,
      owners:[],
      errorSave: {
        name: false,
        cuig: false,
        owner: false
      },
    };
  },
  components: {
    ConfirmationModal,
    CemaInput
  },
  mounted() {
    this.searchOwners()
    this.cuig = this.$route.query.cuig;
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
    ...mapActions("establishment", ["getEstablishment", "saveEstablishment", "deleteEstablishment", "clearEstablishmentData", "listOwners"]),
    ...mapActions(["showSuccess"]),
    startNewWithCuig(){
      this.clearEstablishmentData();
      this.edit = false;
      this.establishment.cuig = this.cuig;
    },
    successCall(message) {
      this.showSuccess(message);
      this.edit = false;
      this.clearEstablishmentData();
    },
    async preSave(){
      this.errorSave = {};
      this.errorSave = {
        name: (!this.establishment.name),
        cuig: (!this.establishment.cuig),
        owner: (!this.establishment.ownerUserName)
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
      this.getEstablishment(this.cuig).then(
        () => {},
        (error) => {
          let modal = new Modal(document.getElementById('SearchModal'));
          modal.show();
          this.edit = false;
        }
      )
    },
    async formDeleteEstablishment() {
      this.errorSave = {};
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
            console.log("Owners:", this.owners);
          }
      )
    }
  },
};

</script>