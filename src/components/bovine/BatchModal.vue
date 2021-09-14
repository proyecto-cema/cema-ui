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
                <div class=" col-12 mb-3" v-if="listBovinesSelected.length!=0">
                  <label>Bovinos Seleccionados: </label> {{listBovinesSelected}}
                </div>
                <div class="row">
                  <div class=" col-12 mb-3 ">
                    <cema-input v-model="batchSelected" component-type="select" required
                                :error-data="{required: true, errorStatus: errorSave.genre,
                                    errorMessage: 'Seleccione el lote a asignar'}"
                                input-title="Lote" input-id="bacthSelect" 
                                :options="[batches.batchName,'Eliminar asignacion Lote','+ Nuevo Lote']" @change="onChange($event)"></cema-input>
                  </div>
                  <div v-if="newLot">
                    <div class=" col-12 mb-3">
                      <cema-input v-model.trim="batch.name" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.tag,
                                    errorMessage: getTagError()['message']}"
                                input-title="Nombre" input-id="batchName" type="text"></cema-input>
                    </div>
                    <div class=" col-12 mb-3">
                      <label class="form-label" for="batchDescription">Descripción<small style="color: red">*</small></label>
                      <textarea
                        id="bovineDescription" v-model.trim="batch.description"
                        class="form-control" maxlength="300"
                        placeholder="Descripción" rows="4" type="text" required
                      ></textarea>
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
          <button v-if=edit class="btn btn-dark text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="deleteModal()">
            Eliminar
          </button>
          <button class="btn btn-primary text-white" 
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
import {REGEX_LETTERS_NUMBERS} from "../../constants";

export default {
  name: "BatchModal",
  data(){
    return {
      ListTagBovines:[],
      batchSelected:null,
      batches:[],
      batch:{
        name:null,
        description:null
      },
      newLot:false,
      success: null,
      errorSave: {
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
        
      }
    }
  },
  methods: {
    ...mapActions("bovine", ["saveBatch", "dismissError", "setupEdit","listBatches","addBatchBovines","deleteBatchBovines"]),
    onChange(event){
      console.log(this.listBovinesSelected)
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
    async formSaveBatch() {
      
      if(this.batchSelected=='+ Nuevo Lote'){
        let data = {
          batch:{ 
            name:this.batch.name,
            description:this.batch.description
            },
          listBovinesSelected:this.listBovinesSelected
        };
        this.saveBatch(data).then(
            (batch) => {
              this.successCall(`El bovinos fueron asiganados al lote ${batch.name} correctamente.`);
            }
        );
      }else if(this.batchSelected=='Eliminar asignacion Lote')
      {
        this.deleteBatchBovines({batch:data.batch.name,listBovinesSelected:data.listBovinesSelected}).then(
            (batch) => {
              this.successCall(`El bovinos fueron eliminados del lote ${batch.name} correctamente.`);
            }
        );
      }
      else{
        this.addBatchBovines({batch:data.batch.name,listBovinesSelected:data.listBovinesSelected}).then(
            (batch) => {
              this.successCall(`El bovinos fueron asiganados al lote ${batch.name} correctamente.`);
            }
        );
      }
    },
    async searchBatches() {
      this.listBatches().then(
        (response) => {
            this.batches = response.data[0];
          
          console.log("Respuesta: "+response.data);
          
        }
      )
    }
  }
}
</script>

<style scoped>
</style>