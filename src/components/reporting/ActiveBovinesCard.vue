<template>
  <div class="col-lg-3 col-md-6 col-12 mt-3">
    <div class="active-report-card pt-1 pb-1 pe-1 ps-3">
      <div class="row">
        <img class="col-7" :src="imageDisplay" :alt="altDisplay">
        <div class="col-5 d-flex flex-column text-center">
          <h1><b>{{ activeQuantity }}</b></h1>
          <h4>{{ altDisplay }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActiveBovinesCard",
  props:{
    imageDisplay: {
      type: String,
      required: true
    },
    altDisplay: {
      type: String,
      required: true
    },
    activeQuantity: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.active-report-card{
  background-color: #d7f2e9ff;
  border-radius: 2%;
}
</style>