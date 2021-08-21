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


export default {
  name: 'App',
  components: {
    NavBar
  },
}
</script>
