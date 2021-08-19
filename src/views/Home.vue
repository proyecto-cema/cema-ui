<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/images/cema_logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {mapActions} from "vuex";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
}
</script>
