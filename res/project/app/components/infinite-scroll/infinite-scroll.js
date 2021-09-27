var InfiniteScroll = Vue.extend({
  template:'#infinite-scroll',
  methods: {
    emitThreshold: App.util.Obj.debounce(function(){
      this.$emit('scrollBottom', true);
    }, 300, true),
    scrollUpdate: function(){
      var topPadding = 20;
      var parentHeight = this.$el.getBoundingClientRect().height;
      var scrollOffset = this.$el.scrollTop;
      var childHeight = this.$refs.contentBody.getBoundingClientRect().height;

      if((parentHeight+scrollOffset-topPadding) >= childHeight){
        this.emitThreshold();
      }
    }
  },
  mounted: function(){
    var view = this;
    this.$el.addEventListener('scroll', function(){
      window.requestAnimationFrame(function(){
        view.scrollUpdate();
      });
    }, {
      passive: true
    });
  }
});
Vue.component('infinite-scroll',InfiniteScroll);
