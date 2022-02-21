<template>
  <div class="imagen-fondo Portada">
    <div class="container">
      <div class="row text-center">
        <div class="col-md-7 offset-md-5 col-lg-6 offset-lg-6 col-xl-5 offset-xl-7" style="margin-top: 100px">
          <form @submit.prevent="processForm" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5)">
            <div class="col-md-10 offset-md-1">
              <img src="../../assets/images/cema_logo.png" style="width: 75%" alt="Logo CEMA" />
              <div class="alert alert-danger" v-if="error.type !== ''">
                {{ error.message }}
              </div>
              <input
                type="text"
                placeholder="Usuario"
                class="form-control my-2"
                v-model.trim="username"
                :class="[error.type === 'user' ? 'is-invalid' : '']"
              />
              <input
                type="password"
                placeholder="Contraseña"
                class="form-control my-2"
                v-model.trim="pass"
                :class="[error.type === 'pass' ? 'is-invalid' : '']"
              />
              <div class="row" hidden>
                <div class="col-lg-5 col-md-12" style="padding-top: 8px">
                  <input type="checkbox" id="cbox2" value="remember" checked />
                  <label style="color: white" for="cbox2">Recuerdame</label>
                </div>
                <div class="col-lg-7 col-md-12 negrita in-line">
                  <a class="nav-link text-secondary in-line negrita">¿Olvidaste tu contraseña?</a>
                </div>
              </div>
              <button type="submit" class="btn btn-primary text-white button-margin" :disabled="loading">
                <span v-show="loading" class="spinner-border spinner-border-sm"> </span>
                <span>Iniciar Sesión</span>
              </button>
              <div class="row" style="padding-bottom: 15px">
                <div class="col-md-7 in-line" style="padding-top: 8px">
                  <label style="color: white">¿Por primera vez en <b>CEMA</b>?</label>
                </div>
                <div class="col-md-5 in-line negrita">
                  <a class="nav-link text-secondary" href="mailto:proyecto-cema@outlook.com">Contáctanos</a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import UserService from '../../services/users/user.service';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      pass: '',
      loading: false,
      redirect: '',
    };
  },
  computed: {
    bloquear() {
      return this.pass.length <= 3;
    },
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    ...mapState('auth', ['error']),
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
    this.redirect = this.$route.query.redirect || '/';
    console.log(this.redirect);
  },
  methods: {
    ...mapActions('auth', ['login']),
    async processForm() {
      this.loading = true;
      if (!this.username) {
        this.error.type = 'user';
        this.error.message = 'Debe ingregar su usuario';
        this.loading = false;
        return;
      }
      if (!this.pass) {
        this.error.type = 'pass';
        this.error.message = 'Por favor ingrese su contraseña';
        this.loading = false;
        return;
      }
      try {
        let user = { username: this.username, password: this.pass };
        this.login(user).then(
          () => {
            console.log('Logged in as', user.username);
            this.$router.push(this.redirect);
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
        if (!this.error) {
          return;
        }
        this.username = '';
        this.pass = '';
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style scoped>
.imagen-fondo {
  background-image: url('../../assets/images/login_background.png');
}
.Portada {
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
}
.in-line {
  padding-left: 0px;
  padding-right: 0px;
}
.button-margin {
  margin-top: 10px;
  margin-bottom: 10px;
}
.negrita {
  font-weight: bold;
}
</style>
