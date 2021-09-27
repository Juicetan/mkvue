var CopyInput = Vue.extend({
  template:'#copy-input',
  props: {
    value: String,
    label: String,
    mode: {
      default: 'field', //field,area
      type: String
    }
  },
  data: function(){
    return {
      clip: null,
    };
  },
  computed: {
    isSingle: function(){
      return this.mode === 'field';
    }
  },
  watch: {
    value: function(newVal, oldVal){
      if(newVal){
        this.initClipboard();
      }
    }
  },
  methods: {
    initClipboard: function(){
      var view = this;
      if(this.clip){
        this.clip.destroy();
      }
      this.clip = new ClipboardJS(this.$refs.modifier,{
        target: function(){
          return view.$refs.value;
        }
      });
      this.clip.on('success', function(e){
        App.toast('Copied '+ (view.label || view.value));
      });
    }
  },
  mounted: function(){
    if(!this.clip){
      this.initClipboard();
    }
  }
});
Vue.component('copy-input',CopyInput);
