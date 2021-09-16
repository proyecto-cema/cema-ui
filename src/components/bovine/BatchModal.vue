<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId+'Label'" class="modal-title">Administrar Lotes </h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-12">
                <div class=" col-12 mb-3" >
                  <div v-if="listBovinesSelected.length!=0"><label>Bovinos Seleccionados: </label> {{listBovinesSelected}}</div>
                  <div v-else> No se selecciono ningún bovino </div>
                </div>
                <div class="row">
                  <div class=" col-12 mb-3 ">
                    <cema-input v-model="batchSelected" component-type="select" required
                                :error-data="{required: true, errorStatus: errorSave.batchSelected,
                                errorMessage: 'Seleccione el lote a asignar'}"
                                input-title="Lote" input-id="bacthSelect" 
                                :options="batches" @change="onChange($event)"></cema-input>
                   
                  </div>
                  <div v-if="newLot">
                    <div class=" col-12 mb-3">
                      <cema-input v-model.trim="batch.name" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.name,
                                errorMessage: getBatchNameError()['message']}"
                                input-title="Nombre" input-id="batchName" type="text"></cema-input>
                    </div>
                    <div class=" col-12 mb-3">
                      <label class="form-label" for="batchDescription">Descripción<small style="color: red">*</small></label>
                      <textarea
                        id="bovineDescription" v-model.trim="batch.description" 
                        :error-data="{required: true, errorStatus: errorSave.description,errorMessage: 'Ingrese la Descripcion del lote'}"
                        class="form-control" maxlength="300" :class="[errorSave.description ? 'is-invalid' : '']"
                        placeholder="Descripción" rows="4" type="text" required
                      ></textarea>
                      <div v-if="errorSave.description" class="textError">
                          <span class="is-invalid"></span>Ingrese la Descripcion del lote
                      </div>
                    </div>
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
          <button class="btn btn-primary text-white" :disabled="!batchSelected"
                  type="button" v-on:click="saveModal()">
            {{ "Guardar" }}
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import CemaInput from "../CemaInput";
import {mapActions, mapState} from "vuex";
import {REGEX_SPACES} from "../../constants";

export default {
  name: "BatchModal",
  data(){
    return {
      batchSelected:{},
      batches:[],
      batch:{
        name:null,
        description:null
      },
      newLot:false,
      success: null,
      errorSave: {
        batchSelected:false,
        name: false,
        description: false
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
  mounted(){
    this.newLot=false;
    this.searchBatches();
  },
  computed: {
    ...mapState("bovine",["error","listBovinesSelected"]),
    errorSaveHelper(){
      return {
        batchSelected:!this.batchSelected,
        name: !this.getBatchNameError()["isValid"],
        description: !this.batch.description
      }
    }
  },
  methods: {
    ...mapActions("bovine", ["saveBatch", "dismissError","listBatches","addBatchBovines","deleteBatchBovines"]),
    getBatchNameError(){
      let message = 'Ingrese el nombre del lote.';
      let isValid = !!this.batch.name;
      let testRegex = REGEX_SPACES.test(this.batch.name);
      if (isValid && !testRegex){
        message = 'El nombre de lote ingresado no es valido. El nombre no puede contener espacios en blanco.'
        isValid = false;
      }
      return {isValid: isValid, message: message}
    },
    onChange(event){
      console.log(this.batchSelected)
      this.newLot=false;
      if(event.target.value=='+ Nuevo Lote'){
        this.newLot=true
      }
    },
    clean(){
      this.errorSave = {};
      this.success = null;
      this.dismissError();
    },
    successCall(message) {
      this.success = message;
      this.dismissError();
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if(this.newLot==true){
        if (this.errorSave.name || this.errorSave.description || this.errorSave.batchSelected) {
        console.error(this.errorSave)
        return
        }
      }
      this.formSaveBatch()
    },
    async formSaveBatch() {
      
      if(this.batchSelected=='+ Nuevo Lote'){
        let data = {
            name:this.batch.name,
            description:this.batch.description,
            listBovinesSelected:this.listBovinesSelected
        };
        this.saveBatch(data).then(
            (batch) => {
              this.successCall(` El lote ${batch.data.batchName} se creo correctamente.`);
            }
        );
      }else if(this.batchSelected=='- Eliminar asignacion Lote')
      {
        if(this.listBovinesSelected.length==0){
          message = 'El nombre de lote ingresado no es valido. El nombre no puede contener espacios en blanco.'
          isValid = false;
          return
        }
        this.deleteBatchBovines({batch: this.batchSelected , listBovinesSelected: this.listBovinesSelected}).then(
            (batch) => {
              this.successCall(`El bovinos fueron eliminados del lote ${batch.data.batchName} correctamente.`);
            }
        );
      }
      else{
        this.addBatchBovines({batch: this.batchSelected , listBovinesSelected: this.listBovinesSelected}).then(
            (batch) => {
              this.successCall(`Los bovinos fueron asiganados al lote ${batch.data.batchName} correctamente.`);
            }
        );
      }
    },
    async searchBatches() {
      this.listBatches().then(
        (response) => {
          console.log(response.data)
          
          for(var i = 0;response.data.length>i;i++){
             this.batches[i]= response.data[i].batchName
           }
            this.batches[this.batches.length]='- Eliminar asignacion Lote';
            this.batches[this.batches.length]='+ Nuevo Lote';
        }
      )
    }
  }
}
</script>

<style scoped>
</style>