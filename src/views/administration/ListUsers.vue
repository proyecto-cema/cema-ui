<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button" @click="openAddUserModal(null, null)">
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
            <td>{{ user.name }}, {{ user.lastName }}</td>
            <td v-if="!this.isMobile">{{ user.establishmentCuig }}</td>
            <td v-if="!this.isMobile">{{ user.role }}</td>
            <td class="text-end">
              <font-awesome-icon
                class="me-2"
                icon="edit"
                @click.stop="openAddUserModal(user, index)"
              ></font-awesome-icon>
              <font-awesome-icon
                icon="trash"
                :class="this.currentUser.user.userName === user.userName ? 'disabled-icon me-2' : 'me-2'"
                @click.stop="formDeleteUser(user.userName, index)"
              >
              </font-awesome-icon>
              <font-awesome-icon
                :icon="user.enabled ? 'user-slash' : 'user'"
                :class="this.currentUser.user.userName === user.userName ? 'disabled-icon' : ''"
                @click.stop="formDisableUser(index)"
              >
              </font-awesome-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <confirmation-modal
    :confirmation-message="'¿Confirma que desea eliminar al usuario ' + selected['userName'] + '?'"
    modal-id="DeleteModal"
    title="Eliminar"
    @acceptModal="
      modalDelete();
      this.deleteModal.hide();
    "
    @rejectModal="
      this.deleteModal.hide();
      this.selected = {};
    "
  ></confirmation-modal>
  <confirmation-modal
    :confirmation-message="`¿Confirma que desea ${disable['action']} al usuario ${disable['userName']}?`"
    modal-id="DisableModal"
    title="Deshabilitar"
    @acceptModal="
      modalDisable();
      this.disableModal.hide();
    "
    @rejectModal="
      this.disableModal.hide();
      this.disable = {};
    "
  ></confirmation-modal>
  <user-modal modalId="addUserModal" @deleteModal="deleteUserForm" @userSaved="saveUserForm"></user-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import ConfirmationModal from '../../components/ConfirmationModal';
import UserModal from '../../components/administration/UserModal';
import { ROLE_REPRESENTATION } from '../../constants';

export default {
  name: 'ListBovine',
  data() {
    return {
      selected: {},
      disable: {},
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
    this.disableModal = new Modal(document.getElementById('DisableModal'));
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
    ...mapActions('user', ['listUsers', 'deleteUser', 'clearUserData', 'setupEditUser', 'changeUser']),
    ...mapActions(['showSuccess']),
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
      this.selected = {
        userName: userName,
        index: index,
      };
    },
    searchUserForUsername(userName) {
      let index = null;
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].userName === userName) {
          index = i;
          userName = this.users[i].userName;
          console.log(`Searched user: ${userName}, found at ${index}`);
          break;
        }
      }
      if (index === null) {
        console.error(`Searched tag: ${userName}, was not found`);
      }
      return index;
    },
    saveUserForm({ user, userName }) {
      if (userName) {
        this.users.push(user);
        this.setIndexForUserName(userName, this.users.length - 1);
      } else {
        this.users[this.selected.index] = user;
        this.selected = {};
      }
    },
    deleteUserForm(userName) {
      let index = this.searchUserForUsername(userName);
      this.setIndexForUserName(userName, index);
      this.modalDelete();
    },
    formDeleteUser(userName, index) {
      this.setIndexForUserName(userName, index);
      this.deleteModal.show();
    },
    openAddUserModal(user, index) {
      this.clearUserData();
      if (user) {
        this.setIndexForUserName(user.userName, index);
        this.setupEditUser(user);
      }
      this.addUserModal.show();
    },
    async modalDelete() {
      console.log(`Deleting user ${this.selected['userName']}`);
      this.deleteUser(this.selected).then(() => {
        this.users.splice(this.selected['index'], 1);
        this.showSuccess(`El usuario ${this.selected['userName']} se eliminó correctamente`);
        this.selected = {};
      });
    },
    async searchUsers() {
      this.users = [];
      this.listUsers(this.currentRole).then((users) => {
        this.users = users;
        console.log(users);
      });
    },
    async modalDisable() {
      let user = this.disable['user'];
      let index = this.disable['index'];
      user.enabled = !user.enabled;
      this.setupEditUser(user);
      this.changeUser(user).then(() => {
        this.showSuccess(
          `El usuario ${user['userName']} se ${this.disable['user'].enabled ? 'habilitó' : 'deshabilitó'} correctamente`
        );
        this.users[index].enabled = !this.users[index].enabled;
        this.clearUserData();
      });
    },
    async formDisableUser(index) {
      this.disable['index'] = index;
      this.disable['user'] = { ...this.users[index] };
      this.disable['userName'] = this.disable.user.userName;
      this.disable['action'] = this.disable['user'].enabled ? 'deshabilitar' : 'habilitar';
      this.disableModal.show();
    },
  },
};
</script>
<style scoped>
.disabled-icon {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
