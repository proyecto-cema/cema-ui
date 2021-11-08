
<template>
  <div >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5  class="modal-title">Registrar Usuario</h5>
          <!-- <h5  class="modal-title">{{ edit ? "Editar Usuario" : "Registrar Registrar" }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" v-on:click="clean()" type="button"></button> -->
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="user.userName" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.userName,
                                    errorMessage: 'Ingrese el nonbre de usuario'}"
                                input-title="Usuario" input-id="userName" type="text" :disabled="edit"></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="user.establishmentCuig" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.establishmentCuig,
                                    errorMessage: 'Ingrese el cuig del establecimiento'}"
                                input-title="CUIG" input-id="establishmentCuig" type="text" ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="user.name" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.name,
                                    errorMessage: 'Ingrese el nombre de la persona'}"
                                input-title="Nombre" input-id="Name" type="text" ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="user.lastName" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.lastName,
                                    errorMessage: 'Ingrese el apellido de la persona'}"
                                input-title="Apellido" input-id="lastName" type="text" ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="user.email" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.email,
                                    errorMessage: 'Ingrese el email de la persona'}"
                                input-title="Email" input-id="userEmail" type="text" ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="user.phone" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.phone,
                                    errorMessage: 'Ingrese el telefono de la persona'}"
                                input-title="Telefono" input-id="userPhone" type="text" ></cema-input>
                  </div>
                 
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="password" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.password,
                                    errorMessage: 'Ingrese la contraseña del usuario'}"
                                input-title="Contraseña" input-id="userPassword" type="password" ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model.trim="passwordRepeat" maxlength="10" required
                                :error-data="{required: true, errorStatus: errorSave.passwordRepeat,
                                    errorMessage: getPasswordError()['message']}"
                                input-title="Repetir Contraseña " input-id="userPasswordRepeat" type="password" ></cema-input>
                  </div>
                  <div class="col-lg-6 col-12 mb-3">
                    <cema-input v-model="user.role" component-type="select" required
                                :error-data="{required: true, errorStatus: errorSave.role,
                                    errorMessage: 'Seleccione el rol del usuario'}"
                                input-title="Rol" input-id="userRole"
                                :options="['Patron','Peon']"></cema-input>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary text-white" 
                  type="button" v-on:click="saveModal()">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import CemaInput from "../../components/form/CemaInput";
// import CemaInput from "../form/CemaInput";
import {mapActions, mapState} from "vuex";

import {REGEX_LETTERS_NUMBERS} from "../../constants";

export default {
  name: "AddUser",
  data(){
    return {
      password:null,
      passwordRepeat:null,
      errorSave: {
        userName:false,
        name: false,
        lastName :false,
        role :false,
        phone :false,
        password :false,
        passwordRepeat :false,
        email:false
      },
    };
  },
  components: { CemaInput },
  computed: {
    ...mapState("user", ["user"]),
    errorSaveHelper(){
      return {
        userName: !this.user.userName,
        name: !this.user.name,
        lastName: !this.user.lastName,
        role: !this.user.role,
        phone: !this.user.phone,
        password: !this.password,
        passwordRepeat: !this.getPasswordError()["isValid"],
        establishmentCuig: !this.user.establishmentCuig,
        email: !this.user.email,
      }
    }
  },
  methods: {
    ...mapActions("user", ["getUser", "saveUser", "setupEditBovine", "clearUserData"]),
    ...mapActions(["showSuccess"]),
    getPasswordError(){
      let message = 'Ingrese la contraseña nuevamente.';
      let isValid = !!this.passwordRepeat;
      if (isValid && (this.password!=this.passwordRepeat)){
        message = 'Las contraseñas ingresadas no coinsiden.'
        isValid = false;
      }
      return {isValid: isValid, message: message}
    },
    clean(){
      this.errorSave = {};
      this.clearBovineData()
    },
    successCall(message) {
      this.showSuccess(message);
    },
    saveModal() {
      this.errorSave = this.errorSaveHelper;
      if (this.errorSave.userName || this.errorSave.name || this.errorSave.lastName || this.errorSave.role || this.errorSave.phone || this.errorSave.establishmentCuig || this.errorSave.email || this.errorSave.password || this.errorSave.passwordRepeat) {
        console.error(this.errorSave)
        return
      }
      this.formSaveUser()
    },
    async formSaveUser() {
      let data = {
        password: this.password,
        user:this.user
      };
      this.saveUser(data).then(
          (User) => {
            this.successCall(`El usuario ${User.user.userName} se guardó correctamente.`);
            this.setupEditBovine(User);
          }
      );
    },
  }
}
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