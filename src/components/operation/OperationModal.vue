<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center" v-if="!nextStep">
          <h5 :id="modalId + 'Label'" class="modal-title">{{ edit ? 'Editar Operacion' : 'Registrar Operacion' }}</h5>
          <button
            aria-label="Close"
            class="btn-close"
            data-bs-dismiss="modal"
            v-on:click="clean()"
            type="button"
          ></button>
        </div>
        <div class="modal-body" v-if="!nextStep">
          <form @submit.prevent="">
            <div class="row ms-2 me-2">
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="operation.transactionDate"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.transactionDate,
                    errorMessage: 'Ingrese la fecha de la transaccion',
                  }"
                  input-title="Fecha de transacción"
                  input-id="transactionDate"
                  type="date"
                ></cema-input>
                <div class="mt-4 d-flex justify-content-center">
                  <cema-switch v-model="extraData.isSell"></cema-switch>
                </div>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="operation.description"
                  maxlength="300"
                  component-type="textarea"
                  input-title="Descripción"
                  input-id="operationDescription"
                  type="text"
                  rows="4"
                ></cema-input>
              </div>
              <div v-if="extraData.isSell" class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="operation.buyerName"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.sellerBuyerName,
                    errorMessage: 'Ingrese el nombre del Comprador',
                  }"
                  input-title="Nombre comprador"
                  input-id="operationBuyerName"
                  type="text"
                ></cema-input>
              </div>
              <div v-else class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model.trim="operation.sellerName"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.sellerBuyerName,
                    errorMessage: 'Ingrese el nombre del vendedor',
                  }"
                  input-title="Nombre vendedor"
                  input-id="sellerName"
                  type="text"
                ></cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6">
                <cema-input
                  v-model="operation.amount"
                  :error-data="{
                    required: true,
                    errorStatus: errorSave.amount,
                    errorMessage: 'Ingrese el monto de la transacción',
                  }"
                  input-title="Monto"
                  input-id="amount"
                  min="0"
                  type="number"
                >
                </cema-input>
              </div>
              <div class="mb-3 col-12 col-md-6" v-if="extraData.isSell">
                <tag-search :error-save="errorSave" v-model="operation.bovineTag" v-if="!edit" :filters="['active']" />
                <label v-else>Caravana relacionada: {{ operation.bovineTag }}</label>
              </div>
            </div>
          </form>
        </div>
        <div v-if="nextStep">
          <div class="modal-header text-center">
            <h5 :id="modalId + 'Label'" class="modal-title">{{ edit ? 'Editar Bovino' : 'Registrar Bovino' }}</h5>
            <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              v-on:click="clean()"
              type="button"
            ></button>
          </div>
          <div class="modal-body" v-if="nextStep">
            <bovine-modal-content :error-save="errorSaveBovine"></bovine-modal-content>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal" type="button" @click="clean()">
            Cancelar
          </button>
          <button v-if="edit" class="btn btn-primary text-white" type="button" @click="clean()">Crear Nuevo</button>
          <div v-if="extraData.isSell || edit || nextStep">
            <button class="btn btn-secondary text-white" type="button" @click="formValidateOperation()">
              {{ edit ? 'Modificar' : 'Guardar' }}
            </button>
          </div>
          <div v-else>
            <button
              class="btn btn-secondary text-white"
              :disabled="!operation.amount"
              type="button"
              @click="stepSaveBovine()"
            >
              {{ 'Siguiente' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CemaSwitch from '../form/CemaSwitchOperation';
import TagSearch from '../activity/TagSearch';
import BovineModalContent from '../bovine/BovineModalContent';

import { mapActions, mapState } from 'vuex';
import CemaInput from '../form/CemaInput';

export default {
  name: 'OperationModal',
  data() {
    return {
      nextStep: false,
      validTagBovine: '',
      errorSave: {
        bovine: false,
        transactionDate: false,
        amount: false,
        bovineTag: false,
        sellerBuyerName: false,
      },
      errorSaveBovine: {
        tag: false,
        taggingDate: false,
        genre: false,
        category: false,
        status: false,
      },
    };
  },
  components: {
    TagSearch,
    CemaInput,
    CemaSwitch,
    BovineModalContent,
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  emits: ['modalSuccess'],
  computed: {
    ...mapState('operation', ['operation', 'edit', 'extraData']),
    ...mapState('bovine', ['bovine']),

    validateSellerOrBuyerName() {
      let valid = true;
      if (this.extraData.isSell) {
        valid = !this.operation.buyerName;
      } else {
        valid = !this.operation.sellerName;
      }
      return valid;
    },
    errorSaveHelper() {
      return {
        transactionDate: !this.operation.transactionDate,
        amount: !this.operation.amount,
        bovineTag: !this.operation.bovineTag,
        sellerBuyerName: this.validateSellerOrBuyerName,
      };
    },
    errorSaveBovineHelper() {
      return {
        tag: !this.getTagError()['isValid'],
        taggingDate: !this.bovine.taggingDate,
        genre: !this.bovine.genre,
        category: !this.bovine.category,
        status: !this.bovine.status,
      };
    },
  },
  mounted() {
    this.clearBovineData();
  },
  methods: {
    ...mapActions('operation', ['saveOperation', 'clearOperationData']),
    ...mapActions('bovine', ['getBovine', 'saveBovine', 'clearBovineData']),
    ...mapActions(['showSuccess', 'showErrorFront']),
    getTagError() {
      return this.tagHasError(this.bovine.tag);
    },
    clean() {
      this.nextStep = false;
      this.errorSave = {};
      this.errorSaveBovine = {};
      this.clearOperationData();
      this.clearBovineData();
    },
    successCall(message) {
      this.showSuccess(message);
      this.clean();
      this.$emit('modalSuccess');
    },
    async stepSaveBovine() {
      this.errorSave = this.errorSaveHelper;
      console.log('Operacion ' + this.operation.amount);
      if (!this.edit && (this.errorSave.transactionDate || this.errorSave.amount || this.errorSave.sellerBuyerName)) {
        console.error(this.errorSave);
        return;
      }
      this.nextStep = true;
    },
    async formValidateOperation() {
      this.errorSave = this.errorSaveHelper;
      if (this.errorSave.transactionDate || this.errorSave.amount || this.errorSave.sellerBuyerName) {
        console.error(this.errorSave);
        return;
      }
      if (this.extraData.isSell) {
        this.getBovine(this.operation.bovineTag).then((response) => {
          console.log(response);
          let bovine = {
            edit: true,
            bovine: response,
          };
          if (bovine.bovine.status === 'Vendido') {
            this.showErrorFront(`Esta caravana ${bovine.bovine.tag} ya se encuentra en estado vendido.`);
          } else {
            bovine.bovine.status = 'Vendido';
            this.formSaveOperationSell(bovine);
          }
        });
      } else {
        this.fromValidateBovine();
      }
    },
    async formSaveOperationSell(bovine) {
      this.operation.operationType = 'sell';
      this.operation.sellerName = null;
      console.log('Operacion: ' + this.operation);
      let saveOperation = {
        edit: this.edit,
        operation: this.operation,
      };
      this.saveOperation(saveOperation).then((operation) => {
        this.saveBovineSellData(bovine);
      });
    },
    async saveBovineSellData(bovine) {
      this.saveBovine(bovine).then(() => {
        this.successCall(`La venta del bovino ${this.bovine.tag} se realizo con exito.`);
      });
    },
    fromValidateBovine() {
      this.errorSaveBovine = this.errorSaveBovineHelper;
      if (this.checkErrors(this.errorSaveBovine)) {
        console.error(this.errorSaveBovine);
        return;
      }
      this.formSaveBovine();
    },
    async formSaveBovine() {
      this.operation.operationType = 'buy';
      this.operation.buyerName = null;
      this.operation.bovineTag = this.bovine.tag;
      let operation = {
        edit: this.edit,
        operation: this.operation,
      };
      let data = {
        edit: false,
        bovine: this.bovine,
      };
      this.saveBovine(data).then((bovine) => {
        this.formSaveOperationBuy(operation, bovine);
      });
    },
    async formSaveOperationBuy(operation, bovine) {
      console.log('Operacion:  ' + operation);
      this.saveOperation(operation).then(() => {
        this.successCall(`La compra del bovino con caravana ${bovine.tag} se guardó correctamente.`);
      });
    },
  },
};
</script>
<style scoped></style>
