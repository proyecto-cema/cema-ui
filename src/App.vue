<template>
  <div class="wrapper" v-if="!$route.meta.plainLayout">
    <SideBar />
    <div id="content" :class="this.sideNav ? '' : 'active'">
      <NavBar />
      <div class="container-fluid">
        <router-view />
      </div>
      <div class="toast-container position-absolute bottom-0 end-0 p-3" id="all-toasts">
        <toast-message
          v-for="toastData in dataToasts"
          :key="toastData.id"
          :message="toastData.message"
          :color="toastData.color"
          :toastId="toastData.id"
        ></toast-message>
        <toast-message
          v-for="toastData in notificationsToasts"
          :key="toastData.id"
          :auto-remove="false"
          :date-data="toastData.date"
          :message="toastData.message"
          :color="toastData.color"
          :toastId="toastData.id"
          :description="toastData.description"
        ></toast-message>
      </div>
    </div>
    <user-modal modalId="myDataUserModal" :hide-actions="true"></user-modal>
    <contact-modal modalId="contactMeModal"></contact-modal>
  </div>
  <div v-if="$route.meta.plainLayout">
    <router-view />
  </div>
</template>

<script>
import SideBar from './components/SideBar.vue';
import NavBar from './components/NavBar';
import ToastMessage from './components/ToastMessage';
import { mapState } from 'vuex';
import UserModal from './components/administration/UserModal';
import ContactModal from './components/ContactModal';

export default {
  name: 'App',
  inject: ['workbox'],
  components: {
    ToastMessage,
    NavBar,
    SideBar,
    UserModal,
    ContactModal,
  },
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener('waiting', () => {
        this.showUpdateUI = true;
      });
    }
  },
  computed: {
    ...mapState(['dataToasts', 'notificationsToasts']),
    sideNav() {
      return this.$store.state.sidenav;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    async accept() {
      this.showUpdateUI = false;
      await this.$workbox.messageSW({ type: 'SKIP_WAITING' });
    },
  },
};
</script>

<style>
#all-toasts {
  z-index: 2000;
}
.wrapper {
  display: flex;
  width: 100%;
}
#content {
  width: calc(100% - 250px);
  min-height: 100vh;
  transition: all 0.3s;
  position: absolute;
  top: 0;
  right: 0;
}

#content.active {
  width: 100%;
}
@media (max-width: 768px) {
  #content {
    width: 100%;
  }
  #content.active {
    width: calc(100% - 250px);
  }
  #sidebarCollapse span {
    display: none;
  }
}
</style>
<style lang="scss">
@import './assets/styles/custom.scss';
@import './assets/styles/calendar.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
