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
            <div class="row">
              <div class="col-8 offset-2">
                <table class="table">
                  <thead>
                    <tr v-if="batch.bovineTags !== []">
                      <th scope="col" class="text-center">Bovinos Asignados</th>
                      <th class="text-center" scope="col">Eliminar</th>
                    </tr>
                    <tr v-else>
                      <th scope="col">El lote seleccionado no posee bovinos asiganados</th>
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
                          v-on:click="formDeleteBatch(batch.batchName, tagBovine, index, batch.establishmentCuig)">
                      </font-awesome-icon>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="mostrar()">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from "../CemaInput";
import {mapActions, mapState} from "vuex";

export default {
  name: "EditBatchModal",
  data(){
    return {
      deleteModal: null,
      deleted: {}
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
  },
  methods: {
    ...mapActions("bovine", ["deleteBatchBovines"]),
    setIndexForTag(batchName, bovineTag, index, cuig){
      this.deleted = {
        batchName: batchName,
        bovineTag: [bovineTag],
        index: index,
        cuig: cuig,
      };
    },
    formDeleteBatch(name, tagBovine, index, cuig) {
      this.setIndexForTag(name, tagBovine, index, cuig);
      this.modalDelete();
    },
    async modalDelete() {
      console.log(`Deleting batch ${this.deleted["batchName"]}`)
      this.deleteBatchBovines(this.deleted).then(
          () => {
            this.batch.bovineTags.splice(this.deleted["index"], 1);
          }
      );
    },
  }
}
</script>

<style>

</style>