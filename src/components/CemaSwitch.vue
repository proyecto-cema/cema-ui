<template>
  <div class="row marginTop">
    <div class="col-3 col-lg-2 ">Lote</div>  
    <div class="col-4 col-lg-3 ">
      <label class="switch">
        <input type="checkbox" id="togBtn" v-model="value" v-bind="$attrs" />
        <div class="slider round"></div>
      </label>
    </div>
    <div class="col-3 col-lg-2"><label>Caravana</label></div>  
  </div> 
</template>

<script>

export default {
  inheritAttrs: false,
  name: "Switch",
  emits: ['update:modelValue'],
  props: {
    options: {},
    modelValue: {},
  },
  computed:{
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
};
</script>

<style>
.marginTop{
  margin-top: 30px;
}
.switch {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 34px;
  }
  
  .switch input {display:none;}
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #a3a1a1;
    -webkit-transition: .4s;
    transition: .4s;
     border-radius: 34px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #027DB4;
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }
  
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(45px);
  }
  
  .slider:after
  {
   color: white;
   display: block;
   position: absolute;
   transform: translate(-50%,-50%);
   top: 50%;
   left: 50%;
   font-size: 10px;
   font-family: Verdana, sans-serif;
  }

  </style>