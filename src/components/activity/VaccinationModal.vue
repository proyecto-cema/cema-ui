<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId+'Label'" class="modal-title">{{ edit ? "Editar Vacunacion" : "Registrar Vacunacion" }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-lg-6 col-12">
                <div class=" col-12 mb-3">
                  <cema-switch v-model="vaccineBovine" @click="changeSwitch(!vaccineBovine)"></cema-switch>
                </div>
                <div class=" col-12 mb-3">
                  <cema-input v-model.trim="vaccine.dose" maxlength="20" 
                    input-title="Dosis" input-id="Dose" type="text" ></cema-input>
                </div>
                <div class=" col-12 mb-3">
                  <cema-input v-model="vaccine.executionDate" :max="getToday" 
                    input-title="Fecha de vacunacion" input-id="executionDate" type="date">
                  </cema-input>
                </div>
                 <div class=" col-12 mb-3">
                  <cema-input v-model="vaccine.drug"
                    input-title="Droga" input-id="drug" type="text">
                  </cema-input>
                </div>
                 <div class=" col-12 mb-3">
                  <cema-input v-model="vaccine.brand" 
                    input-title="Marca" input-id="brand" type="text">
                  </cema-input>
                </div>
              </div>  
              <div class="col-lg-6 col-12">
                <div class="row">
                  
                  <div class=" col-12 mb-3" v-if="vaccineBovine">
                    <cema-input v-model.trim="vaccine.bovineTag" maxlength="10" required
                      :error-data="{required: true, errorStatus: errorSave.bovineBatch,
                      errorMessage: 'Ingrese el tag del bovino'}"
                      input-title="Caravana" input-id="VaccineBovineTag" type="text" ></cema-input>
                  </div>
                  <div class="col-12 mb-3" v-else>
                    <cema-input v-model="vaccine.batchName" required maxlength="10"
                      :error-data="{required: true, errorStatus: errorSave.bovineBatch,
                      errorMessage: 'Ingrese el lote a vacunar'}" type="text" 
                      input-title="Lote" input-id="batchName">
                    </cema-input>
                  </div>
                  <div class="col-12 mb-3">
                    <cema-input v-model="vaccine.product" required
                        input-title="Producto" input-id="product" type="text">
                    </cema-input>
                  </div>
                  <div class="col-12 mb-3">
                    <cema-input v-model="vaccine.name" required
                      :error-data="{required: true, errorStatus: errorSave.name,
                      errorMessage: 'Ingrese el Nombre de la actividad'}"
                      input-title="Nombre" input-id="name" type="text">
                    </cema-input>
                  </div>
                  <div class="col-12 mb-3">
                    <cema-input v-model.trim="vaccine.description" maxlength="300" 
                                component-type="textarea"
                                input-title="Observaciones" input-id="vaccineDescription" type="text" 
                                rows="4">
                    </cema-input>
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
          <button class="btn btn-secondary text-white" :disabled="!vaccine.bovineTag && !vaccine.batchName"
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
import CemaSwitch from "../form/CemaSwitch";
import {mapActions, mapState} from "vuex";

export default {
  name: "vaccineModal",
  data(){
    return {
      success: null,
      errorSave: {
        bovineTag: false,
        batchName:false,
        name: false
      },
    };
  },
  components: { CemaInput,CemaSwitch },
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState("vaccine", ["vaccine", "error", "edit","vaccineBovine"]),
    getToday(){
      return this.getMomentToday()
    },
    errorSaveHelper(){
      return {
        bovineBatch: this.validate(),
        drug: !this.vaccine.drug,
        name: !this.vaccine.name
      }
    }
  },
  methods: {
    ...mapActions("vaccine", ["getVaccine", "saveVaccine", "dismissError", "setupEditVaccine", "clearVaccineData","changeVaccineBovine"]),
    changeSwitch(bolSwitch){
      this.changeVaccineBovine(bolSwitch)
    },
    validate(){
      if(this.vaccineBovine){
        return !this.vaccine.bovineTag
      }else{
        return !this.vaccine.batchName
      }
    },
    clean(){
      this.errorSave = {};
      this.success = null;
      this.dismissError();
      this.clearVaccineData()
    },
    successCall(message) {
      this.success = message;
      this.dismissError();
    },
    deleteModal() {
      this.$emit('deleteModal', this.vaccine.id);
      this.clean();
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.errorSave.bovineBatch ||this.errorSave.executionDate || this.errorSave.name ) {
        console.error(this.errorSave)
        return
      }
      this.formSaveVaccine()
    },
    async formSaveVaccine() {
      if(this.vaccineBovine){
        this.vaccine.batchName=null
      }else{
        this.vaccine.bovineTag=null
      }
      let data = {
        edit: this.edit,
        vaccine: this.vaccine
      };
      this.saveVaccine(data).then(
          (vaccine) => {
            this.successCall(`Los datos de la vacunacion fueron guardados correctamente`);
            this.setupEditVaccine(vaccine);
          }
      );
    },
  }
}
</script>
<style>
</style>
