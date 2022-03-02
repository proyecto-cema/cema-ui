<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 class="modal-title">Contáctanos</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="sendData">
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="userData.email"
                      required
                      input-title="Email"
                      :input-id="`${modalId}-userEmail`"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.email,
                        errorMessage: 'Ingrese su email',
                      }"
                      type="email"
                      autocomplete="email"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="userData.phone"
                      maxlength="15"
                      required
                      input-title="Teléfono"
                      :input-id="`${modalId}-userPhone`"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.email,
                        errorMessage: 'Ingrese su teléfono',
                      }"
                      type="text"
                    ></cema-input>
                  </div>
                  <div class="col-lg-12 col-12 mb-3">
                    <cema-input
                      v-model.trim="bugData.description"
                      maxlength="300"
                      component-type="textarea"
                      input-title="Descripción"
                      input-id="bovineDescription"
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.description,
                        errorMessage: 'Ingrese su consulta',
                      }"
                      type="text"
                      rows="4"
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
          <button class="btn btn-secondary text-white" type="button" @click="sendData">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from './form/CemaInput';
import { ROLE_REPRESENTATION } from '../constants';
import { mapActions } from 'vuex';

export default {
  name: 'ContactModal',
  data() {
    return {
      userData: {},
      bugData: {},
      errorSave: {},
      mailData: {
        mailBody: '',
        mailSubject: '',
        mail: 'proyecto-cema@outlook.com',
      },
    };
  },
  components: { CemaInput },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    currentRole() {
      if (this.currentUser) {
        return ROLE_REPRESENTATION[this.currentUser.user.role.toUpperCase()];
      }
      return null;
    },
    errorSaveHelper() {
      return {
        phone: !this.userData.phone,
        email: !this.userData.email,
        description: !this.bugData.description,
      };
    },
    mailToRef() {
      return `mailto:${this.mailData.mail}?subject=${encodeURIComponent(
        this.mailData.mailSubject
      )}&body=${encodeURIComponent(this.mailData.mailBody)}`;
    },
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.initialData();
  },
  methods: {
    ...mapActions(['showSuccess']),
    initialData() {
      if (this.currentUser) {
        this.userData = {
          email: this.currentUser.user.email,
          phone: this.currentUser.user.phone,
        };
      }
    },
    clean() {
      console.log('Cleaning contact data');
      this.bugData = {};
      this.errorSave = {};
      this.mailData = {
        mailBody: '',
        mailSubject: '',
        mail: 'proyecto-cema@outlook.com',
      };
    },
    sendData() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        return;
      }
      this.mailData.mailSubject = `Consulta de ${this.currentUser.user.name} ${this.currentUser.user.lastName} (${this.currentRole})`;
      this.mailData.mailBody =
        this.bugData.description +
        '\n\nLa siguiente información es para uso interno:' +
        `\nEmail: ${this.userData.email}` +
        `\nTeléfono: ${this.userData.phone}` +
        `\nCUIG: ${this.currentUser.user.establishmentCuig}` +
        `\nUsuario: ${this.currentUser.user.userName}` +
        `\nRol: ${this.currentRole}`;
      window.open(this.mailToRef, '_blank');
      this.showSuccess('Se abrirá su gestor de correos con la información del email.');
      this.clean();
    },
  },
};
</script>

<style scoped></style>
