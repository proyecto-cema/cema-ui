<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId+'Label'" class="modal-title">{{ edit ? "Editar Establecimiento" : "Registrar Establecimiento" }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
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
                <cema-input v-model="establishment.ownerUserName" component-type="select"
                            input-title="Propietario" input-id="establishmentOwner"
                            :options="owners" optionKey="userName" v-slot="{ option }">
                  {{ option.name+" "+option.lastName }}
                </cema-input>
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
                  type="button" v-on:click="formDeleteEstablishment()">
            Eliminar
          </button>
          <button class="btn btn-secondary text-white" :disabled="!establishment.cuig"
                  type="button" v-on:click="formSaveEstablishment()">
            {{ edit ? "Modificar":"Guardar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from "vuex";
import { Modal } from 'bootstrap';
import CemaInput from "../form/CemaInput";


export default {
  name: "EstablishmentModal",
  data() {
    return {
      owners:[],
      errorSave: {
        name: false,
        cuig: false
      },
    };
  },
  components: {
    CemaInput
  },
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.searchOwners();
  },
  computed: {
    ...mapState("establishment", ["establishment", "edit"]),
    errorSaveHelper(){
      return {
        name: !this.establishment.name,
        cuig: !this.establishment.cuig
      }
    }
  },
  methods: {
    ...mapActions("establishment", ["getEstablishment", "saveEstablishment", "deleteEstablishment", "clearEstablishmentData", "listOwners"]),
    ...mapActions(["showSuccess"]),
    clean(){
      this.errorSave = {};
      this.clearEstablishmentData();
    },
    formDeleteEstablishment(){
      this.$emit('deleteModal', this.establishment.cuig);
      this.clean();
    },
    successCall(message) {
      this.showSuccess(message);
      this.clearEstablishmentData();
    },
    async formSaveEstablishment() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave)
        return
      }
      this.saveEstablishment({establishment: this.establishment}).then(
          (establishment) => {
            this.$emit('createdNew', {establishment: establishment, edit: this.edit});
            this.successCall(`El establecimiento con cuig ${establishment.cuig} se guardó correctamente`);
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