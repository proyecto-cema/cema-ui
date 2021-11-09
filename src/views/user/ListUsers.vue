<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button"
              v-on:click="openAddUserModal(null)">
        + Nuevo Usuario
      </button>
    </div>
    <h2 class="h2 mt-3">Calendario de actividades</h2>
    <!-- <form @submit.prevent="">
      <div class="row">
       
        <div class="col-12 col-md-6 col-lg-4">
          <cema-input v-model="search.lastName" component-type="select" required
                      input-title="Rol" input-id="userRole" :label="false"
                      :options="['Peon', 'Hembra']" class="mb-2"></cema-input>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2 mb-2">
          <button class="btn btn-primary text-white"
                  type="button"
                  v-on:click="this.clearSearchUsersData()">
            Restablecer
          </button>
          <button class="btn btn-secondary text-white"
                  type="button"
                  v-on:click="this.searchUsers()">
            Buscar
          </button>
        </div>
      </div>
    </form> -->
    <div class="col-12 table-responsive">
      <table class="table">
        <thead>
        <tr v-if="users.left !== 0">
          <th scope="col">Usuario</th>
          <th scope="col">Nombre</th>
          <th v-if="!this.isMobile" scope="col">Cuig</th>
          <th v-if="!this.isMobile" scope="col">Rol</th>
          <th class="text-end" scope="col">Acciones</th>
        </tr>
        <tr v-else>
          <th scope="col">No se encontraron resultados.</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in users" :key="user.userName">
          <td>{{ user.userName }}</td>
          <td>{{ user.name }} , {{ user.lastName}}</td>
          <td v-if="!this.isMobile">{{ user.establishmentCuig }}</td>
          <td v-if="!this.isMobile">{{ user.role }}</td>
          <td class="text-end">
            <font-awesome-icon
                class="me-2"
                icon="edit"
                @click.stop="openAddUserModal(user)">
            </font-awesome-icon>
            <font-awesome-icon
                icon="trash"
                @click.stop="formDeleteUsers(user.userName, index)">
            </font-awesome-icon>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- <div v-if="headers.totalPages > 1" class="d-flex justify-content-center">
      <div aria-label="Large button group" class="btn-group" role="group">
        <button :class="headers.currentPage <= 0? 'disabled':''" class="btn btn-outline-primary" type="button"
                v-on:click="this.searchBovinePage(this.headers.currentPage-1)">
          Anterior
        </button>
        <button v-for="i in headers.totalPages" :key="i"
                :class="headers.currentPage === i-1? 'btn-primary':'btn-outline-primary'" class="btn"
                type="button"
                v-on:click="this.searchBovinePage(i-1)">
          {{ i }}
        </button>
        <button :class="headers.currentPage >= headers.totalPages-1? 'disabled':''" class="btn btn-outline-primary"
                type="button"
                v-on:click="this.searchBovinePage(this.headers.currentPage+1)">
          Siguiente
        </button>
      </div>
    </div> -->
  </div>
  <confirmation-modal
      :confirmation-message="'¿Confirma que desea eliminar al usuario ?'"
      modal-id="DeleteModal" title="Eliminar"
      @acceptModal="modalDelete(); this.deleteModal.hide()" @rejectModal="this.deleteModal.hide(); this.deleted = {}"></confirmation-modal>
  <!-- <confirmation-modal
      :confirmation-message="'¿Confirma que desea eliminar al usuario '
      + this.deleted['userName'] + '?'"
      modal-id="DeleteModal" title="Eliminar"
      @acceptModal="modalDelete(); this.deleteModal.hide()" @rejectModal="this.deleteModal.hide(); this.deleted = {}"></confirmation-modal> -->
  <user-modal modalId="addUserModal" @deleteModal="deleteUserForm"></user-modal>
 
</template>
<script>
import {mapActions} from "vuex";
import {Modal} from "bootstrap";
import ConfirmationModal from "../../components/ConfirmationModal";
import CemaInput from "../../components/form/CemaInput";
import UserModal from "../../components/users/UserModal";

export default {
  name: "ListBovine",
  data() {
    return {
      // search: {role: null},
      users: [],
      isMobile: false,
      deleteModal: null,
      addUserModal: null,
      timeout: false,
      delay: 250,
    };
  },
  components: {
    UserModal,
    ConfirmationModal,
    CemaInput
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeTimeOut);
    }
  },
  mounted() {
    this.addUserModal = new Modal(document.getElementById('addUserModal'));
    this.deleteModal = new Modal(document.getElementById('DeleteModal'));
    this.isMobile = screen.width <= 760;
    window.addEventListener('resize', this.resizeTimeOut);
    this.searchUsers();
  },
  methods: {
    ...mapActions("user", ["listUsers", "deleteUser", "clearUserData", "setupEditUser"]),
    resizeTimeOut(){
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onResize, this.delay);
    },
    onResize(event) {
      let previous = this.isMobile;
      this.isMobile = screen.width <= 760;
      console.log("Mobile:", this.isMobile)
      console.log(this.headers)
      if (previous === this.isMobile){return}
    },
    setIndexForUserName(userName, index){
      this.deleted = {
        userName: userName,
        index: index
      };
    },
    deleteUserForm(userName){
      let index = null;
      for (let i=0; i < this.users.length; i++) {
        if (this.user[i].userName === userName) {
          index = i;
          userName = this.user[i].userName
          console.log(`Searched user: ${userName}, found at ${index}`);
          break;
        }
      }
      if (index === null){
        console.error(`Searched tag: ${userName}, was not found`)
        return
      }
      this.setIndexForUserName(userName, index);
      this.modalDelete();
    },
    formDeleteBovine(userName, index) {
      this.setIndexForUserName(userName, index);
      this.deleteModal.show()
    },
    openAddUserModal(user){
      this.clearUserData()
      if (user){
        this.setupEditUser(user)
      }
       this.addUserModal.show()
    },
    async modalDelete() {
      console.log(`Deleting user ${this.deleted["userName"]}`)
      this.deleteUser(this.deleted).then(
          () => {
            this.users.splice(this.deleted["index"], 1);
          }
      );
    },
    async searchUsers() {
      this.users = null;
      this.listUsers("Patron").then(
        (response) => {
          this.users = response.data;
          console.log(response);
        }
      )
    },
  },
};
</script>
<style>
</style>