<script>
import ObjUtil from '../utils/obj';

export default {
  methods: {
    emitThreshold: ObjUtil.debounce(function(){
      this.$emit('scrollBottom', true);
    }, 300, true),
    scrollUpdate: function(){
      var topPadding = 0;
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
}
</script>

<template>
  <div class="infinite-scroll">
    <div class="inner-content-wrap" ref="contentBody">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/css/_mixins" as *;
.infinite-scroll{
  @include miniscroll;
  overflow-y: auto;
  .inner-content-wrap{
    @include clearfix;
  }
}
</style>