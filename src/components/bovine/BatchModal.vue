<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId+'Label'" class="modal-title">Asignar Lote </h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="dismissModal()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-12">
                <div class=" col-12 mb-3" >
                  <div v-if="listBovinesSelected.size !== 0"><label class="me-1">Bovinos Seleccionados: </label>
                    <batch-badge v-for="bovineTag in listBovinesSelected" @click="listBovinesSelected.delete(bovineTag)"
                                 :badge-content="`${selectedCuig}-${bovineTag}`" :badge-type="1"></batch-badge>
                  </div>
                  <div v-else> No se selecciono ningún bovino </div>
                </div>
                <div class="row">
                  <div class=" col-12 mb-3 ">
                    <cema-input v-model="batchSelected" component-type="select" required
                                :error-data="{required: true, errorStatus: errorSave.batchSelected,
                                errorMessage: 'Seleccione el lote a asignar'}"
                                input-title="Lote" input-id="bacthSelect"
                                :options="batches.filter(o => o.establishmentCuig === selectedCuig)" optionKey="batchName" @change="onChange($event)">
                      <template v-slot:default="{ option }">
                        {{ option.batchName }}
                      </template>
                      <template v-slot:extraOptions>
                        <option :value="newBatchSelect">
                          + Nuevo Lote
                        </option>
                      </template>
                    </cema-input>
                  </div>
                  <div v-if="newBatch">
                    <div class=" col-12 mb-3">
                      <cema-input v-model.trim="batch.name" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.name,
                                errorMessage: getBatchNameError()['message']}"
                                input-title="Nombre" input-id="batchName" type="text"></cema-input>
                    </div>
                    <div class=" col-12 mb-3">
                       <cema-input v-model.trim="batch.description" maxlength="300" required
                                component-type="textarea"
                                :error-data="{required: true, errorStatus: errorSave.description,
                                errorMessage: 'Ingrese la descripción del lote'}"
                                input-title="Descripción" input-id="batchDescription" type="text" 
                                rows="4"
                                ></cema-input>
                   </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-dark text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="clean()">
            Cambiar selección
          </button>
          <button class="btn btn-secondary text-white" :disabled="!batchSelected"
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
import BatchBadge from "./BatchBadge";
import ComboSearch from "../ComboSearch";

export default {
  name: "BatchModal",
  data(){
    return {
      batchSelected: "",
      batches: [],
      batch: {
        name: null,
        description: null
      },
      newBatch: false,
      newBatchSelect: 'new batch',
      errorSave: {
        batchSelected: false,
        name: false,
        description: false
      },
    };
  },
  components: { CemaInput, BatchBadge, ComboSearch },
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  mounted(){
    this.searchBatches();
  },
  computed: {
    ...mapState("bovine", ["error", "listBovinesSelected", "selectedCuig"]),
    errorSaveHelper(){
      return {
        batchSelected: !this.batchSelected,
        name: !this.getBatchNameError()["isValid"],
        description: !this.batch.description
      }
    }
  },
  methods: {
    ...mapActions("bovine", ["saveBatch", "listBatches", "addBatchBovines", "removeBovinesFromBatch"]),
    ...mapActions(["showSuccess"]),
    getBatchNameError(){
      let message = 'Ingrese el nombre del lote';
      let isValid = !!this.batch.name;
      let testRegex = REGEX_SPACES.test(this.batch.name);
      if (isValid && !testRegex){
        message = 'El nombre de lote ingresado no es valido. El nombre no puede contener espacios en blanco.'
        isValid = false;
      }
      return {isValid: isValid, message: message}
    },
    onChange(event){
      console.log(this.batchSelected);
      console.log(event.target)
      this.newBatch = event.target.value === this.newBatchSelect;
    },
    dismissModal(){
      this.$emit('cleanSelectedBovines');
      this.clean();
    },
    clean(){
      this.batchSelected = "";
      this.newBatch = false;
      this.errorSave = {};
    },
    successCall(message) {
      this.showSuccess(message);
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.newBatch === true) {
        if (this.errorSave.name || this.errorSave.description || this.errorSave.batchSelected) {
          console.error(this.errorSave)
          return
        }
      }
      this.formSaveBatch()
    },
    async formSaveBatch() {
      let bovineList = [...this.listBovinesSelected];
      if(this.batchSelected === this.newBatchSelect){
        let data = {
            name: this.batch.name,
            description: this.batch.description,
            listBovinesSelected: bovineList
        };
        this.saveBatch(data).then(
            (batch) => {
              console.log("Created", batch);
              this.successCall(`El lote ${batch.data.batchName} se creo correctamente.`);
              this.searchBatches();
            }
        );
      } else {
        this.addBatchBovines({batch: this.batchSelected, listBovinesSelected: bovineList}).then(
            (batch) => {
              this.successCall(`Los bovinos fueron asiganados al lote ${batch.data.batchName} correctamente.`);
              this.$emit('addBovinesToBatch', batch.data.batchName);
            }
        );
      }
    },
    async searchBatches() {
      this.listBatches().then(
        (response) => {
          console.log(response.data)
          this.batches = response.data;
        }
      )
    }
  }
}
</script>

<style scoped>
</style>