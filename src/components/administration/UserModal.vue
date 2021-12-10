<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId + 'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 class="modal-title">{{ edit ? 'Editar Usuario' : 'Registrar Usuario' }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" @click="clean()" type="button"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="" v-if="user">
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="user.userName"
                      maxlength="10"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.userName,
                        errorMessage: 'Ingrese el nonbre de usuario',
                      }"
                      input-title="Usuario"
                      input-id="userName"
                      type="text"
                      :disabled="edit"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="user.establishmentCuig"
                      component-type="select"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.establishmentCuig,
                        errorMessage: 'Ingrese el cuig del establecimiento',
                      }"
                      input-title="CUIG"
                      input-id="establishmentCuig"
                      :options="establishments"
                      optionKey="cuig"
                      v-slot="{ option }"
                    >
                      {{ option.name }}{{ '   (' + option.cuig + ') ' }}
                    </cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="user.name"
                      maxlength="50"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.name,
                        errorMessage: 'Ingrese el nombre de la persona',
                      }"
                      input-title="Nombre"
                      input-id="Name"
                      type="text"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="user.lastName"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.lastName,
                        errorMessage: 'Ingrese el apellido de la persona',
                      }"
                      input-title="Apellido"
                      input-id="lastName"
                      type="text"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="user.email"
                      required
                      input-title="Email"
                      input-id="userEmail"
                      type="email"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="user.phone"
                      maxlength="15"
                      required
                      input-title="Telefono"
                      input-id="userPhone"
                      type="text"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="password"
                      maxlength="10"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.password,
                        errorMessage: 'Ingrese la contraseña del usuario',
                      }"
                      input-title="Contraseña"
                      input-id="userPassword"
                      type="password"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="passwordRepeat"
                      maxlength="10"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.passwordRepeat,
                        errorMessage: getPasswordError()['message'],
                      }"
                      input-title="Repetir Contraseña "
                      input-id="userPasswordRepeat"
                      type="password"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model="user.role"
                      component-type="select"
                      required
                      :error-data="{
                        required: true,
                        errorStatus: errorSave.role,
                        errorMessage: 'Seleccione el rol del usuario',
                      }"
                      input-title="Rol"
                      input-id="userRole"
                      :options="['Patron', 'Peon']"
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
          <button class="btn btn-secondary text-white" type="button" @click="saveModal()">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CemaInput from '../form/CemaInput';
import { mapActions, mapState } from 'vuex';
import { ROLE_REPRESENTATION } from '../../constants';

export default {
  name: 'UserModal',
  data() {
    return {
      password: null,
      passwordRepeat: null,
      errorSave: {
        userName: false,
        name: false,
        lastName: false,
        role: false,
        password: false,
        passwordRepeat: false,
      },
      establishments: [],
    };
  },
  components: { CemaInput },
  computed: {
    ...mapState('user', ['user', 'edit']),
    ...mapState(['establishmentName']),
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
        userName: !this.user.userName,
        name: !this.user.name,
        lastName: !this.user.lastName,
        role: !this.user.role,
        password: !this.password,
        passwordRepeat: !this.getPasswordError()['isValid'],
        establishmentCuig: !this.user.establishmentCuig,
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
    this.searchEstablishments();
  },
  methods: {
    ...mapActions('user', ['getUser', 'saveUser', 'clearUserData', 'setupEditUser']),
    ...mapActions('establishment', ['listEstablishments']),
    ...mapActions(['showSuccess']),
    getPasswordError() {
      let message = 'Ingrese la contraseña nuevamente.';
      let isValid = !!this.passwordRepeat;
      if (isValid && this.password != this.passwordRepeat) {
        message = 'Las contraseñas ingresadas no coinsiden.';
        isValid = false;
      }
      return { isValid: isValid, message: message };
    },
    clean() {
      this.errorSave = {};
      this.password = null;
      this.passwordRepeat = null;
      this.clearUserData();
      this.user.establishmentCuig = this.currentUser.user.establishmentCuig;
    },
    successCall(message) {
      this.showSuccess(message);
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave);
        return;
      }
      this.formSaveUser();
    },
    async formSaveUser() {
      let data = {
        password: this.password,
        user: this.user,
      };
      this.saveUser(data).then((user) => {
        this.successCall(`El usuario ${user.user.userName} se guardó correctamente.`);
        this.setupEditUser(user.user);
      });
    },
    async searchEstablishments() {
      this.establishments = [];
      if (this.currentRole > 1) {
        this.listEstablishments().then((response) => {
          this.establishments = response.data;
          console.log(response);
        });
      } else {
        this.establishments.push({
          name: this.establishmentName,
          cuig: this.currentUser.user.establishmentCuig,
        });
        this.user.establishmentCuig = this.currentUser.user.establishmentCuig;
      }
    },
  },
};
</script>

<style scoped></style>
