var InfiniteScroll = (function(){
  var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  return Vue.extend({
    template:'#infinite-scroll',
    methods: {
      emitThreshold: debounce(function(){
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
})();
Vue.component('infinite-scroll',InfiniteScroll);
