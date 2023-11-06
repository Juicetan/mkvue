<template>
  <div class="loading-bar">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/css/_variables';
.loading-bar {
  @keyframes loading {
    from {
      left: 50%;
      width: 0;
      z-index: 100;
    }
    33.3333% {
      left: 0;
      width: 100%;
      z-index: 10;
    }
    to {
      left: 0;
      width: 100%;
    }
  }
  position: relative;
  width: 100%;
  height: 8px;
  background-color: transparent;
  .bar {
    content: '';
    display: inline;
    position: absolute;
    width: 0;
    height: 100%;
    left: 50%;
    text-align: center;
    &:nth-child(1) {
      background-color: $color-lightblue;
      animation: loading 3s linear 50ms infinite;
    }
    &:nth-child(2) {
      background-color: $color-lightgray;
      animation: loading 3s linear 1s infinite;
    }
    &:nth-child(3) {
      background-color: #ffffff;
      animation: loading 3s linear 2s infinite;
    }
  }
}
</style>