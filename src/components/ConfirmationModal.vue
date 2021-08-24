<template>
  <div :id="modalId" aria-hidden="true" :aria-labelledby="modalId+'Label'" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 :id="modalId+'Label'" class="modal-title">{{ title }}</h5>
          <button aria-label="Close" class="btn-close" v-on:click="rejectModal()" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>{{ confirmationMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-dark text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="rejectModal()">
            {{ btnReject !== null ? btnReject: "No"}}
          </button>
          <button class="btn btn-primary text-white" data-bs-dismiss="modal"
                  type="button" v-on:click="acceptModal()">
            {{ btnAccept !== null ? btnAccept: "Si"}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btnAccept: {
      type: String,
      required: false,
      default: null,
    },
    btnReject: {
      type: String,
      required: false,
      default: null,
    },
    confirmationMessage: {
      type: String,
      required: true
    },
    modalId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },

  },
  methods: {
    acceptModal() {
      this.$emit('acceptModal')
    },
    rejectModal() {
      this.$emit('rejectModal')
    }
  }
}
</script>