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
                <tag-search :error-save="errorSave.bovineTag" v-model="operation.bovineTag" :disabled="edit" />
              </div>
              <!-- <div v-else>
                <div class="mb-3 col-12 col-md-6">
                  <cema-input
                    v-model.trim="operation.bovineTag"
                    maxlength="10"
                    required
                    :error-data="{
                      required: true,
                      errorStatus: errorSave.bovineTag,
                      errorMessage: getTagError()['message'],
                    }"
                    input-title="Caravana"
                    input-id="bovineTag"
                    type="text"
                  ></cema-input>
                </div>
              </div> -->
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
          <div class="modal-body" v-if="nextStep"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal" type="button" v-on:click="clean()">
            Cancelar
          </button>
          <button v-if="edit" class="btn btn-primary text-white" type="button" v-on:click="clean()">Crear Nuevo</button>
          <div v-if="extraData.isSell || edit || nextStep">
            <button class="btn btn-secondary text-white" type="button" v-on:click="formValidateOperation()">
              {{ edit ? 'Modificar' : 'Guardar' }}
            </button>
          </div>
          <div v-else>
            <button
              class="btn btn-secondary text-white"
              :disabled="!operation.amount"
              type="button"
              v-on:click="stepSaveBovine()"
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

import { mapActions, mapState } from 'vuex';
import CemaInput from '../form/CemaInput';
import { REGEX_LETTERS_NUMBERS } from '../../constants';

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
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState('operation', ['operation', 'edit', 'extraData']),
    ...mapState('bovine', ['bovine', 'categories']),

    errorSaveHelper() {
      return {
        transactionDate: !this.operation.transactionDate,
        amount: !this.operation.amount,
        bovineTag: !this.operation.bovineTag,
        sellerBuyerName: this.validateSellerOrBuyerName(),
      };
    },
  },
  mounted() {
    this.clearBovineData();
  },
  methods: {
    ...mapActions('operation', ['getOperation', 'saveOperation', 'deleteOperation', 'clearOperationData']),
    ...mapActions('bovine', [
      'getBovine',
      'listBovines',
      'saveBovine',
      'setupCategories',
      'clearBovineData',
      'setupEditBovine',
    ]),
    ...mapActions(['showSuccess', 'showErrorFront']),

    clean() {
      this.nextStep = false;
      this.errorSave = {};
      this.errorSaveBovine = {};
      this.clearOperationData();
      this.clearBovineData();
    },

    validateSellerOrBuyerName() {
      let valid = true;
      if (this.extraData.isSell) {
        valid = !this.operation.buyerName;
      } else {
        valid = !this.operation.sellerName;
      }
      return valid;
    },

    successCall(message) {
      this.showSuccess(message);
      this.clearOperationData();
    },

    async formSaveOperationSell(bovine) {
      this.operation.operationType = 'sell';
      this.operation.sellerName = null;
      console.log('Operacion:  ' + this.operation);
      let saveOperation = {
        edit: this.edit,
        operation: this.operation,
      };
      this.saveOperation(saveOperation).then((operation) => {
        this.$emit('createdNew', { operation: operation, edit: this.edit });
        this.saveBovine(bovine).then(() => {
          this.successCall('El bovino con caravana ' + bovine.bovine.tag + ' se guardó correctamente.');
        });
      });
    },

    async formValidateOperation() {
      this.errorSave = this.errorSaveHelper;
      if (this.errorSave.transactionDate || this.errorSave.amount || this.errorSave.sellerBuyerName) {
        console.error(this.errorSave);
        return;
      }
      if (this.extraData.isSell) {
        this.getBovine(this.operation.bovineTag).then((response) => {
          let bovine = {
            edit: true,
            bovine: response,
          };
          if (bovine.bovine.status == 'Vendido') {
            this.showErrorFront('Esta caravana ' + bovine.bovine.tag + ' ya se encuentra en estado vendido.');
            return;
          } else {
            bovine.bovine.status = 'Vendido';
            bovine.bovine.birthDate = null;
            this.formSaveOperationSell(bovine);
          }
        });
      } else {
        this.fromValidateBovine();
      }
    },

    async stepSaveBovine() {
      this.errorSave = this.errorSaveHelper;
      console.log('Operacion ' + this.operation.amount);
      if (this.errorSave.transactionDate || this.errorSave.amount || this.errorSave.sellerBuyerName) {
        console.error(this.errorSave);
        return;
      }
      this.nextStep = true;
    },

    unselectedStatus() {
      this.bovine.status = '';
    },

    setCategories() {
      this.bovine.category = '';
      this.setupCategories(this.bovine.genre);
    },

    getTagError() {
      let message = 'Ingrese el número de caravana del bovino.';
      let isValid = !!this.bovine.tag;
      let testRegex = REGEX_LETTERS_NUMBERS.test(this.bovine.tag);
      if (isValid && !testRegex) {
        message = 'La caravana ingresada no es valida. Solo se permiten numeros y letras.';
        isValid = false;
      }
      return { isValid: isValid, message: message };
    },

    getToday() {
      return this.getMomentToday();
    },

    fromValidateBovine() {
      this.errorSave = this.errorSaveHelper;
      if (
        this.errorSave.taggingDate ||
        this.errorSave.tag ||
        this.errorSave.genre ||
        this.errorSave.category ||
        this.errorSave.status
      ) {
        console.error(this.errorSave);
        return;
      }
      this.formSaveBovine();
    },

    async formSaveOperationBuy(operation) {
      console.log('Operacion:  ' + operation);
      this.saveOperation(operation).then((operation) => {
        this.$emit('createdNew', { operation: operation, edit: this.edit });
      });
    },

    async formSaveBovine() {
      this.operation.operationType = 'buy';
      this.operation.buyerName = null;
      this.operation.bovineTag = this.bovine.tag;
      let Operation = {
        edit: this.edit,
        operation: this.operation,
      };
      let data = {
        edit: this.edit,
        bovine: this.bovine,
      };
      this.saveBovine(data).then((bovine) => {
        this.successCall(`El bovino con caravana ${bovine.tag} se guardó correctamente.`);
        this.setupEditBovine(bovine);
        this.formSaveOperationBuy(Operation);
        this.clean();
      });
    },
  },
};
</script>
<style scoped>
.TextCenterImage {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.imageIdBovine {
  width: 60% !important;
}
</style>
