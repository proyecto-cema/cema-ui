<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button" @click="openAddUserModal(null)">
        + Nuevo Usuario
      </button>
    </div>
    <div class="mt-2">
      <h3>Listado de Usuarios</h3>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <thead>
          <tr v-if="users.length !== 0">
            <th scope="col">Usuario</th>
            <th scope="col">Nombre</th>
            <th v-if="!this.isMobile" scope="col">CUIG</th>
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
            <td>{{ user.name }} , {{ user.lastName }}</td>
            <td v-if="!this.isMobile">{{ user.establishmentCuig }}</td>
            <td v-if="!this.isMobile">{{ user.role }}</td>
            <td class="text-end">
              <!-- <font-awesome-icon
                class="me-2"
                icon="edit"
                @click.stop="openAddUserModal(user)">
              </font-awesome-icon> -->
              <font-awesome-icon icon="trash" @click.stop="formDeleteUser(user.userName, index)"> </font-awesome-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="'¿Confirma que desea eliminar al usuario ' + deleted['userName'] + '?'"
    modal-id="DeleteModal"
    title="Eliminar"
    @acceptModal="
      modalDelete();
      this.deleteModal.hide();
    "
    @rejectModal="
      this.deleteModal.hide();
      this.deleted = {};
    "
  ></confirmation-modal>
  <user-modal modalId="addUserModal" @deleteModal="deleteUserForm"></user-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import CemaInput from '../../components/form/CemaInput';
import UserModal from '../../components/administration/UserModal';
import { ROLE_REPRESENTATION } from '../../constants';

export default {
  name: 'ListBovine',
  data() {
    return {
      // search: {role: null},
      deleted: {},
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
  },
  beforeUnmount() {
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
  },
  methods: {
    ...mapActions('user', ['listUsers', 'deleteUser', 'clearUserData', 'setupEditUser']),
    ...mapActions(["showSuccess"]),
    resizeTimeOut() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onResize, this.delay);
    },
    onResize(event) {
      let previous = this.isMobile;
      this.isMobile = screen.width <= 760;
      console.log('Mobile:', this.isMobile);
      console.log(this.headers);
      if (previous === this.isMobile) {
        return;
      }
    },

    setIndexForUserName(userName, index) {
      this.deleted = {
        userName: userName,
        index: index,
      };
    },
    deleteUserForm(userName) {
      let index = null;
      for (let i = 0; i < this.users.length; i++) {
        if (this.user[i].userName === userName) {
          index = i;
          userName = this.user[i].userName;
          console.log(`Searched user: ${userName}, found at ${index}`);
          break;
        }
      }
      if (index === null) {
        console.error(`Searched tag: ${userName}, was not found`);
        return;
      }
      this.setIndexForUserName(userName, index);
      this.modalDelete();
    },
    formDeleteUser(userName, index) {
      this.setIndexForUserName(userName, index);
      this.deleteModal.show();
    },
    openAddUserModal(user) {
      this.clearUserData();
      if (user) {
        this.setupEditUser(user);
      }
      this.addUserModal.show();
    },
    async modalDelete() {
      console.log(`Deleting user ${this.deleted['userName']}`);
      this.deleteUser(this.deleted).then(() => {
        this.users.splice(this.deleted['index'], 1);
        this.showSuccess(`El usuario ${this.deleted['userName']} se eliminó correctamente`);
        this.deleted = {};
      });
    },
    async searchUsers() {
      this.users = [];
      this.listUsers(this.currentRole).then((users) => {
        this.users = users;
        console.log(users);
      });
    },
  },
};
</script>
<style></style>
