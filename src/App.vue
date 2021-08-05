<template>
  <NavBar />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar
  },
  methods: {
    ...mapActions(['cargarLocalStorage'])
  },
  created(){
    this.cargarLocalStorage()
  }
}
</script>