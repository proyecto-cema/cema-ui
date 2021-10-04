<template>
  <div class="toast align-items-center text-white border-0" :class="color"
       role="alert" aria-live="assertive" aria-atomic="true" :id="toastId"  data-bs-autohide="false">
    <div class="d-flex">
      <div class="toast-body">
        {{ message }}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" ref="removeButton"
              @click="removeIndexItemFromToasts(toastId)"></button>
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
    }
  },
  methods:{
    ...mapActions(["removeIndexItemFromToasts"])
  },
  mounted() {
    console.log(this.$refs);
    let toast = document.getElementById(`${this.toastId}`);
    new Toast(toast).show();
    setTimeout(() => this.$refs.removeButton.click(), 5000);
  }
}
</script>

<style scoped>
  .toast {
    z-index: 7000;
  }
</style>