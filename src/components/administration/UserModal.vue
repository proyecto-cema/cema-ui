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
                      :input-id="`${modalId}-userName`"
                      type="text"
                      :disabled="edit"
                      autocomplete="username"
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
                      :input-id="`${modalId}-establishmentCuig`"
                      :options="establishments"
                      :disabled="edit"
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
                      :input-id="`${modalId}-name`"
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
                      :input-id="`${modalId}-lastName`"
                      type="text"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="user.email"
                      required
                      input-title="Email"
                      :input-id="`${modalId}-userEmail`"
                      type="email"
                      autocomplete="email"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input
                      v-model.trim="user.phone"
                      maxlength="15"
                      required
                      input-title="Telefono"
                      :input-id="`${modalId}-userPhone`"
                      type="text"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3" v-if="!edit">
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
                      :input-id="`${modalId}-userPassword`"
                      type="password"
                      autocomplete="new-password"
                    ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3" v-if="!edit">
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
                      :input-id="`${modalId}-userPasswordRepeat`"
                      type="password"
                      autocomplete="new-password"
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
                      :input-id="`${modalId}-userRole`"
                      :options="this.roleList"
                      :disabled="hideActions || user.userName === this.currentUser.user.userName"
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
          <button v-if="edit && !hideActions" class="btn btn-primary text-white" type="button" @click="clean()">
            Crear Nuevo
          </button>
          <button
            v-if="edit && !hideActions && user.userName !== this.currentUser.user.userName"
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
            type="button"
            @click="callDeleteModal()"
          >
            Eliminar
          </button>
          <button class="btn btn-secondary text-white" type="button" @click="saveModal()">
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
import { ROLE_REPRESENTATION, ROLES } from '../../constants';

export default {
  name: 'UserModal',
  emits: ['deleteModal', 'closeModal', 'userSaved'],
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
    ...mapState(['establishmentData']),
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
        password: this.edit || !this.password,
        passwordRepeat: this.edit || !this.getPasswordError()['isValid'],
        establishmentCuig: !this.user.establishmentCuig,
      };
    },
    roleList() {
      return ROLES.slice(0, this.currentRole + 1);
    },
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.currentUser) {
      this.searchEstablishments();
    }
  },
  methods: {
    ...mapActions('user', ['getUser', 'newUser', 'changeUser', 'clearUserData', 'setupEditUser']),
    ...mapActions('establishment', ['listEstablishments']),
    ...mapActions(['showSuccess', 'setEstablishmentData']),
    getPasswordError() {
      let message = 'Ingrese la contraseña nuevamente.';
      let isValid = !!this.passwordRepeat;
      if (isValid && this.password != this.passwordRepeat) {
        message = 'Las contraseñas ingresadas no coinciden.';
        isValid = false;
      }
      return { isValid: isValid, message: message };
    },
    callDeleteModal() {
      this.$emit('deleteModal', this.user.userName);
      this.clean();
    },
    clean() {
      this.errorSave = {};
      this.password = null;
      this.passwordRepeat = null;
      this.clearUserData();
      this.user.establishmentCuig = this.currentUser.user.establishmentCuig;
      this.$emit('closeModal');
    },
    successCall(message) {
      this.showSuccess(message);
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.edit) {
        delete this.errorSave['password'];
        delete this.errorSave['passwordRepeat'];
      }
      if (this.checkErrors(this.errorSave)) {
        console.error(this.errorSave);
        return;
      }
      this.formSaveUser();
    },
    async formSaveUser() {
      if (this.edit) {
        this.changeUser({ user: this.user, isSelf: this.hideActions }).then((user) => {
          this.successCall(`El usuario ${this.user.userName} se guardó correctamente`);
          this.$emit('userSaved', { user: this.user });
        });
      } else {
        let data = {
          password: this.password,
          user: this.user,
        };
        this.newUser(data).then((user) => {
          this.successCall(`El usuario ${user.user.userName} se guardó correctamente`);
          this.setupEditUser(user.user);
          this.$emit('userSaved', { user: user.user, userName: user.user.userName });
        });
      }
    },
    async searchEstablishments() {
      this.establishments = [];
      console.log('The current role is: ', this.currentRole);
      if (this.currentRole > 1) {
        this.listEstablishments().then((response) => {
          this.establishments = response.data;
          console.log(response);
        });
      } else {
        this.setEstablishmentData(this.currentUser.user.establishmentCuig).then(() => {
          console.log('No permissions so adding', this.establishmentData);
          this.establishments.push({
            name: this.establishmentData.name,
            cuig: this.establishmentData.cuig,
          });
          this.user.establishmentCuig = this.currentUser.user.establishmentCuig;
        });
      }
    },
  },
};
</script>

<style scoped></style>
