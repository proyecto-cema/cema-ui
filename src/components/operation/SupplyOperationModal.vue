<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 :id="modalId + 'Label'" class="modal-title">
            {{ edit ? 'Editar Operacion de Insumo' : 'Registrar Operacion de Insumo' }}
          </h5>
          <button
            aria-label="Close"
            class="btn-close"
            data-bs-dismiss="modal"
            v-on:click="clean()"
            type="button"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row ms-2 me-2">
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="supplyOperation.transactionDate"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.transactionDate,
                    errorMessage: 'Ingrese la fecha de la transaccion',
                  }"
                  input-title="Fecha de transacción"
                  input-id="supplyOperationTransactionDate"
                  type="date"
                ></cema-input>
              </div>

              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model="supplyOperation.operationType"
                  component-type="select"
                  required
                  :disabled="edit"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.operationType,
                    errorMessage: 'Seleccione el tipo de operación',
                  }"
                  input-title="Tipo de Operación"
                  input-id="supplyOperationType"
                  option-key="back"
                  :options="operationsTypes"
                >
                  <template v-slot:default="{ option }">
                    {{ option.name }}
                  </template>
                </cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model="supplyOperation.supplyName"
                  component-type="select"
                  input-title="Insumo"
                  input-id="supplyOperationSupplyName"
                  :options="supplies"
                  optionKey="name"
                  :disabled="edit"
                  @change="onChange()"
                  v-slot="{ option }"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.supplyName,
                    errorMessage: 'Seleccione un Insumo',
                  }"
                >
                  {{ option.name }}
                </cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="price"
                  input-title="Precio"
                  input-id="supplyOperationPrecio"
                  type="input"
                  :disabled="true"
                ></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model="supplyOperation.amount"
                  input-title="Cantidad"
                  input-id="supplyOperationAmount"
                  type="number"
                  :disabled="edit"
                  @change="calculationTotalOperation()"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.amount,
                    errorMessage: validateAmount['message'],
                  }"
                ></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="availableSupply"
                  input-title="Diponible"
                  input-id="availableSupply"
                  :disabled="true"
                  type="input"
                ></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="supplyOperation.description"
                  maxlength="300"
                  component-type="textarea"
                  input-title="Descripción"
                  input-id="supplyOperationDescription"
                  type="text"
                  rows="4"
                ></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model="totalOperation"
                  input-title="Monto"
                  input-id="supplyOperationamount"
                  min="0"
                  type="number"
                  :disabled="true"
                >
                </cema-input>
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
            class="btn btn-secondary text-white"
            type="button"
            @click="saveModal()"
            :disabled="!supplyOperation.supplyName"
          >
            {{ edit ? 'Modificar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import CemaInput from '../form/CemaInput';
import { SUPPLY_OPERATION_TYPE } from '../../constants';

export default {
  name: 'SupplyOperationModal',
  data() {
    return {
      supplies: [],
      supplySelected: {},
      errorSave: {
        transactionDate: false,
        operationType: false,
        supplyName: false,
        amount: false,
      },
    };
  },
  components: {
    CemaInput,
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  emits: ['modalSuccess'],
  computed: {
    ...mapState('supplyOperation', ['supplyOperation', 'edit', 'availableSupply', 'price', 'totalOperation']),
    operationsTypes() {
      let list = [];
      for (const key in SUPPLY_OPERATION_TYPE) {
        list.push({ back: key, name: SUPPLY_OPERATION_TYPE[key] });
      }
      return list;
    },
    errorSaveHelper() {
      return {
        transactionDate: !this.supplyOperation.transactionDate,
        operationType: !this.supplyOperation.operationType,
        supplyName: !this.supplyOperation.supplyName,
        amount: this.validateAmount['isValid'],
      };
    },
    validateAmount() {
      let amount = !this.supplyOperation.amount;
      let condition =
        this.supplyOperation.operationType !== 'buy' && this.supplyOperation.amount > this.availableSupply;
      console.log(amount, condition);
      return {
        isValid: amount || condition,
        message: condition ? 'La cantidad no puede ser mayor a la disponible' : 'Ingrese la cantidad',
      };
    },
  },
  mounted() {
    this.searchSuppliesToList();
  },
  methods: {
    ...mapActions('supplyOperation', [
      'saveSupplyOperation',
      'clearSupplyOperationData',
      'setupEditSupplyOperation',
      'getSupplyOperationAvailableForName',
      'setupEditAvailableSupply',
      'setupEditPrice',
      'setupEditTotalOperation',
    ]),
    ...mapActions('supply', ['listSupplies']),

    ...mapActions(['showSuccess', 'showErrorFront']),
    clean() {
      this.errorSave = {};
      this.clearSupplyOperationData();
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave);
        return;
      }
      this.commitSave();
    },
    onChange() {
      for (var i = 0; i < this.supplies.length; i++) {
        if (this.supplies[i].name == this.supplyOperation.supplyName) {
          this.setupEditPrice(this.supplies[i].price);
        }
      }
      this.getSupplyOperationAvailableForName(this.supplyOperation.supplyName).then((response) => {
        this.setupEditAvailableSupply(response.data.available);
        console.log('Disponiblilidad: ' + response);
      });
      this.calculationTotalOperation();
    },
    calculationTotalOperation() {
      if (this.price != null && this.supplyOperation.amount != null) {
        this.setupEditTotalOperation(this.price * this.supplyOperation.amount);
      }
    },
    async commitSave() {
      let editing = this.edit;
      let saveSupply = {
        edit: this.edit,
        supplyOperation: this.supplyOperation,
      };
      this.saveSupplyOperation(saveSupply).then((response) => {
        this.showSuccess(`La operación de insumo ${this.supplyOperation.supplyName} se guardó correctamente`);
        this.setupEditSupplyOperation(this.supplyOperation);
        this.$emit('createdNew', { supplyOperation: this.supplyOperation, edit: editing });
      });
    },
    async searchSuppliesToList(page = 0, size = 100) {
      this.supplies = null;
      this.listSupplies({ page: page, size: size, search: this.search }).then((response) => {
        this.supplies = response.data;
        console.log('Supplies: ' + response);
      });
    },
  },
};
</script>
<style scoped></style>
