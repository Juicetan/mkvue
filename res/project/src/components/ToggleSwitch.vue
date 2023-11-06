<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    }
  },
  methods: {
    toggle(){
      this.$emit('update:modelValue', !this.modelValue);
    }
  },
}
</script>

<template>
  <div class="toggle-switch" v-on:click="toggle">
    <div class="toggle-label">{{label}}</div>
    <i class="toggle-ind fa-solid" v-bind:class="{'fa-toggle-off':!modelValue,'fa-toggle-on':modelValue}"></i>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/css/_mixins';
.toggle-switch{
  .toggle-label{
    display: inline-block;
    font-weight: bold;
    margin: 10px 10px 5px 0;
  }
  .toggle-ind{
    @include clickable;
    font-size: 25px;
    vertical-align: middle;
  }
}
</style>