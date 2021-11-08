<template>
  <div class="wrapper" v-if="!$route.meta.plainLayout">
    <SideBar />
    <div id="content" :class="this.sideNav ? '':'active'">
      <NavBar />
      <div class="container-fluid">
        <router-view/>
      </div>
      <div class="toast-container position-absolute bottom-0 end-0 p-3">
        <toast-message v-for="toastData in dataToasts" :key="toastData.id"
                       :message="toastData.message" :color="toastData.color" :toastId="toastData.id"></toast-message>
        <toast-message v-for="toastData in notificationsToasts" :key="toastData.id" :auto-remove="false" :date-data="toastData.date"
                       :message="toastData.message" :color="toastData.color"
                       :toastId="toastData.id" :description="toastData.description"></toast-message>
      </div>
    </div>
  </div>
  <div v-if="$route.meta.plainLayout">
    <router-view/>
  </div>
</template>

<script>
import SideBar from "./components/SideBar.vue";
import NavBar from "./components/NavBar";
import ToastMessage from "./components/ToastMessage";
import {mapState} from "vuex";


export default {
  name: 'App',
  components: {
    ToastMessage,
    NavBar,
    SideBar
  },
  computed: {
    ...mapState(["dataToasts", "notificationsToasts"]),
    sideNav() {
      return this.$store.state.sidenav;
    }
  }
}
</script>

<style>
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
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
