<template>
  <div class="container">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'">
        <component :is="Component"/>
      </transition>
    </router-view>
    <LoadingOverlay v-if="state?.value?.isLoading"/>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import LoadingOverlay from './components/LoadingOverlay.vue';

export default {
  components: {
    RouterView, 
    LoadingOverlay
  },
  props: {
    state: {
      type: Object,
    }
  },
}
</script>

<style scoped lang="scss">
  .container{
    position: relative;
    height: 100%;
  }
</style>
