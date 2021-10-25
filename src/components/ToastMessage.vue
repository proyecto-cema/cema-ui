<template>
  <div v-if="dateData" class="toast"  aria-atomic="true"
       role="alert" aria-live="assertive" :id="toastId"  data-bs-autohide="false">
    <div class="toast-header">
      <strong class="me-auto">{{ message }}</strong>
      <small class="text-muted">
        {{javaDateToMomentDate(dateData)}}
      </small>
      <button type="button" class="btn-close" ref="removeButton"
              @click="removeToast()" ></button>
    </div>
    <div class="toast-body">
      {{ description }}
      <div class="text-end">
        <router-link class="nav-link" to="/actividades" @click="removeToast()">
          Ver mas
        </router-link>
      </div>
    </div>
  </div>
  <div v-else class="toast align-items-center text-white border-0" :class="color"
       role="alert" aria-live="assertive" aria-atomic="true" :id="toastId"  data-bs-autohide="false">
    <div class="d-flex">
      <div class="toast-body">
        {{ message }}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" ref="removeButton"
              @click="removeToast()"></button>
    </div>
  </div>
</template>

<script>
import {Toast} from "bootstrap";
import {mapActions} from "vuex";

export default {
  name: "ToastMessage",
  props: {
    message: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'bg-primary'
    },
    toastId: {
      type: Number,
      required: true
    },
    autoRemove: {
      type: Boolean,
      default: true
    },
    dateData: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    }
  },
  methods:{
    ...mapActions(["removeIndexItemFromToasts", "removeIndexItemFromNotifications"]),
    removeToast(){
      if(this.autoRemove) {
        clearTimeout(this.timeout);
        this.removeIndexItemFromToasts(this.toastId);
      }else{
        this.removeIndexItemFromNotifications(this.toastId);
      }
    }
  },
  mounted() {
    console.log(this.$refs);
    let toast = document.getElementById(`${this.toastId}`);
    new Toast(toast).show();
    if(this.autoRemove) {
      this.timeout = setTimeout(() => this.removeToast(), 5000);
    }
  }
}
</script>

<style scoped>
  .toast {
    z-index: 7000;
  }
</style>