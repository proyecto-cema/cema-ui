<template>
  <div v-if="!$route.meta.plainLayout">
    <NavBar />
    <div class="container">
      <router-view/>
    </div>
  </div>
  <div v-if="$route.meta.plainLayout">
    <router-view/>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import {mapActions} from "vuex";


export default {
  name: 'App',
  components: {
    NavBar
  },
  methods: {
    ...mapActions(['loadLocalStorage'])
  },
  created(){
    this.loadLocalStorage()
  }
}
</script>
