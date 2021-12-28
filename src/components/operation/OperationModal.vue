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
                <tag-search :error-save="errorSave.bovineTag" v-model="operation.bovineTag" />
              </div>
              <div v-else>
                <div class="mb-3 col-12 col-md-6">
                  <cema-input
                    v-model.trim="operation.bovineTag"
                    maxlength="10"
                    required
                    :error-data="{
                      required: true,
                      errorStatus: errorSave.bovineTag,
                      errorMessage: getTagError(false)['message'],
                    }"
                    input-title="Caravana"
                    input-id="bovineTag"
                    type="text"
                  ></cema-input>
                </div>
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
            <form @submit.prevent="">
              <div class="row">
                <div class="col-lg-4 col-12">
                  <div class="position-relative text-center">
                    <img alt="Identificador" class="imageIdBovine" src="../../assets/images/bovine/tag_bovino.png" />
                    <div class="TextCenterImage">
                      <h4>{{ bovine.establishmentCuig }}<br />{{ bovine.tag }}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-lg-7 col-12">
                  <div class="row">
                    <div class="col-lg-6 col-12 mb-3">
                      <cema-input
                        v-model.trim="bovine.tag"
                        maxlength="10"
                        required
                        readonly
                        input-title="Caravana"
                        input-id="bovineTag"
                        type="text"
                        :disabled="edit"
                      ></cema-input>
                    </div>
                    <div class="col-lg-6 col-12 mb-3">
                      <cema-input
                        v-model="bovine.taggingDate"
                        :max="getToday"
                        required
                        :error-data="{
                          required: true,
                          errorStatus: errorSaveBovine.taggingDate,
                          errorMessage: 'Ingrese la fecha del caravaneo',
                        }"
                        input-title="Fecha de caravaneo"
                        input-id="bovineDate"
                        type="date"
                      ></cema-input>
                    </div>
                    <div class="col-lg-6 col-12 mb-3">
                      <cema-input
                        v-model="bovine.genre"
                        component-type="select"
                        required
                        :disabled="edit"
                        :error-data="{
                          required: true,
                          errorStatus: errorSaveBovine.genre,
                          errorMessage: 'Seleccione el sexo del bovino',
                        }"
                        input-title="Sexo"
                        input-id="bovineGenre"
                        v-on:change="setCategories()"
                        :options="['Macho', 'Hembra']"
                      ></cema-input>
                    </div>
                    <div class="col-lg-6 col-12 mb-3">
                      <cema-input
                        v-model="bovine.birthDate"
                        :max="getToday"
                        input-title="Fecha de nacimiento"
                        input-id="birthDate"
                        type="date"
                      ></cema-input>
                    </div>
                    <div class="col-lg-6 col-12 mb-3">
                      <cema-input
                        v-model="bovine.category"
                        component-type="select"
                        required
                        :error-data="{
                          required: true,
                          errorStatus: errorSaveBovine.category,
                          errorMessage: 'Seleccione la categoria del bovino',
                        }"
                        input-title="Categoria"
                        input-id="bovineCategory"
                        :disabled="edit && (bovine.category == 'Vaca' || bovine.category == 'Toro')"
                        v-on:change="unselectedStatus()"
                        :options="categories"
                      ></cema-input>
                    </div>
                    <div
                      class="col-lg-6 col-12 mb-3"
                      v-if="bovine.category == 'Ternero' || bovine.category == '' || bovine.category == null"
                    >
                      <cema-input
                        v-model="bovine.status"
                        component-type="select"
                        required
                        :error-data="{
                          required: true,
                          errorStatus: errorSaveBovine.status,
                          errorMessage: 'Seleccione el estado del bovino',
                        }"
                        input-title="Estado"
                        input-id="bovineStatus"
                        :disabled="bovine.category == ''"
                        :options="['Mamando', 'Destetado', 'Muerto', 'Vendido']"
                      ></cema-input>
                    </div>
                    <div class="col-lg-6 col-12 mb-3" v-if="bovine.category == 'Vaca'">
                      <cema-input
                        v-model="bovine.status"
                        component-type="select"
                        required
                        :error-data="{
                          required: true,
                          errorStatus: errorSaveBovine.status,
                          errorMessage: 'Seleccione el estado del bovino',
                        }"
                        :disabled="bovine.category == ''"
                        input-title="Estado"
                        input-id="bovineStatus"
                        :options="['Sin preñez', 'Preñada', 'Muerto', 'Vendido']"
                      ></cema-input>
                    </div>
                    <div class="col-lg-6 col-12 mb-3" v-if="bovine.category == 'Toro'">
                      <cema-input
                        v-model="bovine.status"
                        component-type="select"
                        required
                        :error-data="{
                          required: true,
                          errorStatus: errorSaveBovine.status,
                          errorMessage: 'Seleccione el estado del bovino',
                        }"
                        :disabled="bovine.category == ''"
                        input-title="Estado"
                        input-id="bovineStatus"
                        :options="['En servicio', 'Fuera de servicio', 'Muerto', 'Vendido']"
                      ></cema-input>
                    </div>
                    <div class="col-lg-12 col-12 mb-3">
                      <cema-input
                        v-model.trim="bovine.description"
                        maxlength="300"
                        component-type="textarea"
                        input-title="Descripción"
                        input-id="bovineDescription"
                        type="text"
                        rows="4"
                      ></cema-input>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary text-white" data-bs-dismiss="modal" type="button" v-on:click="clean()">
            Cancelar
          </button>
          <button v-if="edit" class="btn btn-primary text-white" type="button" v-on:click="clean()">Crear Nuevo</button>
          <div v-if="extraData.isSell || edit || nextStep">
            <button
              class="btn btn-secondary text-white"
              :disabled="!operation.bovineTag"
              type="button"
              v-on:click="formSaveOperation()"
            >
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
  methods: {
    ...mapActions('operation', ['getOperation', 'saveOperation', 'deleteOperation', 'clearOperationData']),
    ...mapActions('bovine', ['getBovine', 'saveBovine', 'setupCategories']),
    ...mapActions(['showSuccess']),
    clean() {
      this.nextStep = false;
      this.errorSave = {};
      this.errorSaveBovine = {};
      this.clearOperationData();
    },

    validateSellerOrBuyerName() {
      var valid = true;
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
    async formSaveOperation() {
      this.errorSave = this.errorSaveHelper;
      if (
        this.errorSave.transactionDate ||
        this.errorSave.amount ||
        this.errorSave.bovineTag ||
        this.errorSave.sellerBuyerName
      ) {
        console.error(this.errorSave);
        return;
      }
      if (this.extraData.isSell) {
        this.operation.operationType = 'sell';
        this.operation.buyerName = null;
        this.getBovine(this.operation.bovineTag).then((response) => {
          let bovine = {
            edit: true,
            bovine: response,
          };
          console.log(response);
          this.fromSaveBovine(bovine);
        });
      } else {
        this.operation.operationType = 'buy';
        this.operation.sellerName = null;
        this.saveBovineModal();
      }
      let data = {
        edit: this.edit,
        operation: this.operation,
      };
      this.saveOperation(data).then((operation) => {
        this.$emit('createdNew', { operation: operation, edit: this.edit });
        this.successCall(`La operacion se guardó correctamente`);
      });
    },
    async fromSaveBovine(bovine) {
      bovine.status = 'Vendido';
      bovine.birthDate = bovine.taggingDate;
      this.saveBovine(bovine).then(() => {
        this.successCall(`El bovino se guardó correctamente.`);
      });
    },
    async stepSaveBovine() {
      this.errorSave = this.errorSaveHelper;
      let result = this.validateTagBovine();
      if (!result.isValid) {
        console.error(result.message);
        return;
      }
      if (
        this.errorSave.transactionDate ||
        this.errorSave.amount ||
        this.errorSave.bovineTag ||
        this.errorSave.sellerBuyerName
      ) {
        console.error(this.errorSave);
        return;
      }
      this.nextStep = true;
      this.bovine.tag = this.operation.bovineTag;
    },
    //Los siguientes metodos son tomados de BovineModal
    async validateTagBovine() {
      let isValid = true;
      let message = '';
      this.getBovine(this.operation.bovineTag).then((response) => {
        console.log('RESULTADO: ' + response);
        if (response != null) {
          message = 'La caravana ingresada ya existe.';
          isValid = false;
          console.log('RESULTADO1: ' + isValid);
        }
      });
      console.log('RESULTADO2: ' + isValid);

      return { isValid: isValid, message: message };
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
    saveBovineModal() {
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
    async formSaveBovine() {
      let data = {
        edit: this.edit,
        bovine: this.bovine,
      };
      this.saveBovine(data).then((bovine) => {
        this.successCall(`El bovino con caravana ${bovine.tag} se guardó correctamente.`);
        this.setupEditBovine(bovine);
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
