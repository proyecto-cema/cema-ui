<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 class="modal-title">{{ edit ? 'Editar Insumo' : 'Registrar Insumo' }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="supplyData.name"
                      required
                      maxlength="50"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.name,
                        errorMessage: 'Ingrese el nombre del insumo',
                      }"
                      input-title="Nombre"
                      input-id="supplyName"
                      type="text"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="supplyData.categoryName"
                      component-type="select"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.categoryName,
                        errorMessage: 'Seleccione la categoría del insumo',
                      }"
                      input-title="Categoría"
                      input-id="supplyCategoryName"
                      :options="categoriesName"
                      optionKey="name"
                      v-slot="{ option }"
                    >
                      {{ option.name }}
                    </cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="supplyData.price"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.price,
                        errorMessage: 'Ingrese un número válido',
                      }"
                      input-title="Precio"
                      input-id="supplyPrice"
                      type="number"
                      min="0"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="supplyData.units"
                      required
                      maxlength="50"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.units,
                        errorMessage: 'Ingrese la unidad de medición del insumo',
                      }"
                      input-title="Unidad de medición"
                      input-id="supplyUnits"
                      type="text"
                    ></cema-input>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal" type="button" @click="clean()">
            Cancelar
          </button>
          <button v-if="edit" class="btn btn-primary text-white" type="button" @click="clean()">Crear Nuevo</button>
          <button
            v-if="edit"
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
            type="button"
            @click="deleteSupply()"
          >
            Eliminar
          </button>
          <button class="btn btn-secondary text-white" :disabled="!supplyData.name" type="button" @click="saveModal()">
            {{ edit ? 'Modificar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from '../form/CemaInput';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'SupplyModal',
  emits: ['deleteModal', 'createdNew'],
  data() {
    return {
      categoriesName: [],
      errorSave: {
        name: null,
        categoryName: '',
        price: 0,
        units: 0,
      },
    };
  },
  components: { CemaInput },
  computed: {
    ...mapState('supply', ['supplyData', 'edit']),
    errorSaveHelper() {
      return {
        name: !this.supplyData.name,
        categoryName: !this.supplyData.categoryName,
        price: this.supplyData.price < 0 || this.supplyData.price == '',
        units: !this.supplyData.units,
      };
    },
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.searchCategoriesName();
  },
  methods: {
    ...mapActions('supply', ['listCategories', 'clearSupplyData', 'saveSupply', 'setupEditSupply']),
    ...mapActions(['showSuccess']),
    clean() {
      this.errorSave = {};
      this.clearSupplyData();
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave);
        return;
      }
      this.commitSave();
    },
    deleteSupply() {
      this.$emit('deleteModal', this.supplyData.name);
      this.clean();
    },
    async commitSave() {
      let editing = this.edit;
      this.saveSupply().then((response) => {
        this.showSuccess(`El insumo ${this.supplyData.name} se guardó correctamente`);
        this.setupEditSupply(this.supplyData);
        this.$emit('createdNew', { supply: this.supplyData, edit: editing });
      });
    },
    async searchCategoriesName() {
      this.listCategories().then((response) => {
        this.categoriesName = response.data;
        console.log(response);
        console.log('Categorias:', this.categoriesName);
      });
    },
  },
};
</script>

<style scoped></style>
