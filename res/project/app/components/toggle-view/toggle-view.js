var ToggleView = Vue.extend({
  template:'#toggle-view',
  props:['value','label'],
  methods:{
    toggle:function(){
      this.$emit('input',!this.value);
    }
  }
});
Vue.component('toggle-view',ToggleView);