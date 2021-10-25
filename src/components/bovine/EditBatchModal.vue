<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId+'Label'" class="modal-title">Editar Bovinos del lote {{batch.batchName}}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <cema-input v-model.trim="batch.description" maxlength="300" required
                        component-type="textarea"
                        :error-data="{required: true, errorStatus: nullDescription,
                                errorMessage: 'Ingrese la descripción del lote'}"
                        input-title="Descripción" input-id="batchDescription" type="text"
                        rows="4"
            ></cema-input>
            <div class="row" v-if="batch.bovineTags.length !== 0">
              <div class="col-10 offset-1">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col" class="text-center">Bovinos Asignados</th>
                      <th class="text-center" scope="col">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(tagBovine, index) in batch.bovineTags" :key="tagBovine">
                    <td class="text-center">{{ tagBovine }}</td>
                    <td class="text-center">
                      <font-awesome-icon
                          icon="trash"
                          style="cursor:pointer;font-size:20px;"
                          title="Eliminar bovino del lote"
                          v-on:click="removeFromList(index)">
                      </font-awesome-icon>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <label v-else>El lote seleccionado no posee bovinos asiganados, para asignarlos dirijase a el listado de bovinos</label>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-dark text-white" data-bs-dismiss="modal"
                  type="button">
            Cancelar
          </button>
          <button class="btn btn-secondary text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="saveModifications()">
            Modificar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from "../form/CemaInput";
import {mapActions, mapState} from "vuex";

export default {
  name: "EditBatchModal",
  data(){
    return {
      deleteModal: null,
      name: "",
    };
  },
  components: { 
    CemaInput,
  },
  props: {
    modalId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState("bovine", ["batch", "error"]),
    nullDescription(){
      return !this.batch.description
    }
  },
  methods: {
    ...mapActions("bovine", ["deleteBatch", "saveBatch", "setCuig"]),
    ...mapActions(["showSuccess"]),
    successCall(message) {
      this.showSuccess(message);
    },
    removeFromList(index) {
      this.batch.bovineTags.splice(index, 1);
    },
    saveModifications(){
      this.setCuig(this.batch.establishmentCuig);
      let data = {
        name: this.batch.batchName,
        description: this.batch.description,
        listBovinesSelected: this.batch.bovineTags,
      };
      this.deleteBatch({name: this.batch.batchName, cuig: this.batch.establishmentCuig}).then(
          () => {
            console.log("Continue with creation");
            this.saveBatch(data).then(
                () => {
                  this.successCall(`El lote ${data.name} se modificó correctamente.`);
                }
            );
          },
          (error) => {
            console.log(error);
          }
      );
    }
  }
}
</script>

<style>

</style>