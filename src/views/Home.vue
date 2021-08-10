<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <form @submit.prevent="procesarFormulario">
      <input
          type="text"
          placeholder="Usuario"
          class="form-control my-2"
      >
    </form>
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
  methods: {
    ...mapActions(["registerUser"]),
    async procesarFormulario() {
      try {
        await this.registerUser("pruebasuper@gmail.com", "1231412",{
          "email": "pruebasuper@gmail.com",
          "lastName": "super",
          "name": "prueba",
          "phone": 3541330188,
          "role": "admin",
          "userName": "prueba"
        });
        if (this.error !== null) {
          return;
        }
        this.email = "";
        this.pass1 = "";
      } catch (error) {
        console.error(error);
      }
    },
  },
}
</script>
