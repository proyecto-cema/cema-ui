<template>
  <div class="wrapper" v-if="!$route.meta.plainLayout">
    <SideBar />
    <div id="content">
      <NavBar />
      <div class="container">
        <router-view/>
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


export default {
  name: 'App',
  components: {
    NavBar,
    SideBar
  },
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

.full-width {
  height: 94vh;
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
