<template>
  <div class="toast align-items-center text-white border-0" :class="color"
       role="alert" aria-live="assertive" aria-atomic="true" :id="toastId"  data-bs-autohide="false">
    <div class="d-flex">
      <div class="toast-body">
        {{ message }}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</template>

<script>
import {Toast} from "bootstrap";

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
      type: String,
      required: true
    }
  },
  mounted() {
    new Toast(document.getElementById(this.toastId));
  }
}
</script>

<style scoped>
  .toast {
    z-index: 7000;
  }
</style>