<template>
  <div class="row mt-3 d-flex justify-content-center">
    <button class="btn btn-secondary text-white col-lg-4 col-10" type="button"
            v-on:click="openActivityModal()">
      Crear actividad
    </button>
  </div>

  <activity-modal modalId="activityModal"></activity-modal>
</template>

<script>
import ActivityModal from "../../components/activity/ActivityModal";
import {Modal} from "bootstrap";

export default {
  name: "ActivitySelector",
  date(){
    return{
      activityModal: null,
    }
  },
  mounted() {
    this.activityModal = new Modal(document.getElementById('activityModal'));
  },
  components: {
    ActivityModal,
  },
  methods: {
    openActivityModal(){
      this.activityModal.show()
    }
  }
}
</script>

<style scoped>

</style>