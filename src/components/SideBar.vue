<template>
  <nav id="sidebar" :class="sidenav ? '' : 'active'">
    <router-link to="/" class="sidebar-header">
      <img src="../assets/images/cema_logo.png" alt="" height="200" class="d-inline-block align-text-top" />
    </router-link>

    <ul class="list-unstyled components d-flex flex-column" v-if="currentUser" style="height: calc(100vh - 200px)">
      <li v-for="(navItem, i) in sidenavItems" class="nav-item" :class="navItem.specialClass" :key="i">
        <router-link
          v-if="!navItem.isCollapsible && navItem.roleRequirement <= currentRole"
          class="nav-link"
          @click="navItemCollapse(i)"
          active-class="activeSideBar"
          :to="{ name: navItem.route }"
          exact
        >
          <font-awesome-icon style="width: 40px; padding-right: 10px" v-if="navItem.icon" :icon="navItem.icon" />
          <span class="nav-link-text">{{ navItem.name }}</span>
        </router-link>
        <a
          v-if="navItem.isCollapsible && navItem.roleRequirement <= currentRole"
          class="nav-link dropdown-toggle"
          href="javascript:void(0)"
          @click="navItemCollapse(i)"
          data-toggle="collapse"
          :aria-expanded="navItem.expanded"
        >
          <font-awesome-icon style="width: 40px; padding-right: 10px" v-if="navItem.icon" :icon="navItem.icon" />
          <span class="nav-link-text">{{ navItem.name }}</span>
        </a>
        <div v-if="navItem.isCollapsible" class="collapse" :class="navItem.expanded ? 'show' : ''">
          <ul class="nav nav-sm flex-column">
            <li v-for="subItem in navItem.items" class="nav-item" :key="subItem.name">
              <template v-if="subItem.roleRequirement <= currentRole">
                <router-link v-if="!subItem.clickable" class="nav-link" :to="{ name: subItem.route }">{{
                  subItem.name
                }}</router-link>
                <a v-else class="nav-link" @click.prevent="subItem.clickAction">
                  <font-awesome-icon
                    style="width: 40px; padding-right: 10px"
                    v-if="subItem.icon"
                    :icon="subItem.icon"
                  />
                  {{ subItem.name }}
                </a>
              </template>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { ROLE_REPRESENTATION } from '../constants';
import { Modal } from 'bootstrap';

export default {
  name: 'SideBar',
  data() {
    return {
      myUserModal: null,
      sidenavItems: [
        { name: 'Tablero', isCollapsible: false, icon: 'chart-line', route: 'Dashboard', roleRequirement: 1 },
        {
          name: 'Bovinos',
          isCollapsible: true,
          expanded: false,
          icon: 'tags',
          roleRequirement: 0,
          items: [
            { name: 'Gestión', isCollapsible: false, route: 'ListBovine', roleRequirement: 0 },
            { name: 'Lotes', isCollapsible: false, route: 'ListBatch', roleRequirement: 0 },
          ],
        },
        {
          name: 'Actividades',
          isCollapsible: true,
          expanded: false,
          icon: 'calendar-alt',
          roleRequirement: 0,
          items: [
            { name: 'Calendario', isCollapsible: false, route: 'Calendar', roleRequirement: 0 },
            { name: 'Ubicaciones', isCollapsible: false, route: 'ListLocations', roleRequirement: 1 },
          ],
        },
        {
          name: 'Económico',
          isCollapsible: true,
          expanded: false,
          icon: 'money-bill-alt',
          roleRequirement: 0,
          items: [
            { name: 'Operaciones', isCollapsible: false, route: 'ListOperations', roleRequirement: 0 },
            { name: 'Insumos', isCollapsible: false, route: 'ListSupplies', roleRequirement: 1 },
          ],
        },
        {
          name: 'Administración',
          isCollapsible: true,
          expanded: false,
          icon: 'desktop',
          roleRequirement: 1,
          items: [
            { name: 'Subscripciones', isCollapsible: false, route: 'ListSubscriptions', roleRequirement: 1 },
            { name: 'Usuarios', isCollapsible: false, route: 'ListUser', roleRequirement: 1 },
            { name: 'Establecimientos', isCollapsible: false, route: 'ListEstablishments', roleRequirement: 2 },
            { name: 'Auditoria', isCollapsible: false, route: 'ListAudits', roleRequirement: 2 },
          ],
        },
        {
          name: 'Salud',
          isCollapsible: true,
          expanded: false,
          icon: 'heartbeat',
          roleRequirement: 0,
          items: [
            { name: 'Enfermedades', isCollapsible: false, route: 'ListDiseases', roleRequirement: 0 },
            { name: 'Seguimiento', isCollapsible: false, route: 'ListIllness', roleRequirement: 0 },
          ],
        },
      ],
    };
  },
  mounted() {
    this.myUserModal = Modal.getOrCreateInstance(document.getElementById('myDataUserModal'));
    this.contactModal = Modal.getOrCreateInstance(document.getElementById('contactMeModal'));
    let items;
    if (this.currentUser) {
      items = [
        { name: 'Mi Establecimiento', clickable: true, clickAction: this.showEstablishment, roleRequirement: 1 },
        { name: 'Mi Perfil', clickable: true, clickAction: this.showUserData, roleRequirement: 0 },
        { name: 'Contáctanos', clickable: true, clickAction: this.showContactModal, roleRequirement: 0 },
        { name: 'Cerrar Sesión', clickable: true, clickAction: this.logOut, roleRequirement: 0 },
      ];
      this.sidenavItems.push({
        name: `${this.currentUser['user']['userName']}`,
        specialClass: 'd-lg-none',
        isCollapsible: true,
        expanded: false,
        icon: 'user',
        items: items,
      });
    }
  },
  computed: {
    ...mapState(['sidenav']),
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
    ...mapActions('user', ['setupEditUser']),
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    showEstablishment() {
      this.$router.push({
        name: 'ListSubscriptions',
        params: { modal: true },
      });
    },
    showUserData() {
      this.setupEditUser(this.currentUser.user);
      this.myUserModal.show();
    },
    showContactModal() {
      this.contactModal.show();
    },
    navItemCollapse(index) {
      this.sidenavItems = this.sidenavItems.map((item, i) => {
        item.expanded = !item.expanded;
        if (i !== index) {
          item.expanded = false;
        }
        return item;
      });
    },
  },
};
</script>

<style scoped>
a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}
#sidebar {
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 999;
  background: #212529;
  color: #fff;
  transition: all 0.3s;
}

#sidebar.active {
  margin-left: -250px;
}

#sidebar .sidebar-header {
  padding: 20px;
  background: #212529;
}

#sidebar ul.components {
  padding: 20px 0;
  border-bottom: 1px solid #212529;
}

#sidebar ul p {
  color: #fff;
  padding: 10px;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
}

#sidebar ul li a:hover,
.activeSideBar,
.activeSideBar:active {
  color: #000000 !important;
  background: #fff;
}

#sidebar ul li.active > a,
a[aria-expanded='true'] {
}

a[data-toggle='collapse'] {
  position: relative;
}

.dropdown-toggle::after {
  display: block;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
}

@media (max-width: 768px) {
  #sidebar {
    margin-left: -250px;
  }

  #sidebar.active {
    margin-left: 0;
  }
}
</style>
