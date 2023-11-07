<script>
import LoadingBar from '../components/LoadingBar.vue';

export default {
  components: {
    LoadingBar,
  },
  beforeRouteEnter: function(to, from, next){
    next(vm => {
      // Do some initialization
    })
  },
  data(){
    return {
    }
  },
  methods: {
  },
}
</script>

<template>
  <div class="dashboard-page">
    <LoadingBar/>
    <h1>Dashboard</h1>
  </div>
</template>

<style scoped lang="scss">
  .dashboard-page{
    position: relative;
    height: 100%;
  }
</style>