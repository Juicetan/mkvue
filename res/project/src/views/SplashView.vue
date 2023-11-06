<script>
import LoadingBar from '../components/LoadingBar.vue';
import Router from '../router/index';

export default {
  components: {
    LoadingBar
  },
  beforeRouteEnter: function(to, from, next){
    next(vm => {
      // App or config initialization here
      setTimeout(function(){
        Router.replace({
          name: 'dashboard'
        })
      }, 2000);
    })
  },
  methods: {
  },
}
</script>

<template>
  <div class="splash-page">
    <LoadingBar/>
    <img src="@/assets/images/appicon.png" alt="" class="logo">
  </div>
</template>

<style>
.splash-page{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .logo{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    width: 400px;
    height: 400px;
  }
}
</style>
