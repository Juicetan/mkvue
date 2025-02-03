<template>
  <div class="loading-overlay">
    <div class="spin-wrap">
      <div class="spinner">
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/css/_variables" as *;
.loading-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(white, 0.8);
  z-index: $loader-z;
  .spin-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  .spinner {
    position: relative;
    width: 50px;
    height: 50px;
    text-align: center;
    animation: sk-rotate 2s infinite linear;
  }
  .dot1,
  .dot2 {
    width: 60%;
    height: 60%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: $color-lightblue;
    border-radius: 100%;
    animation: sk-bounce 2s infinite ease-in-out;
  }
  .dot2 {
    top: auto;
    bottom: 0;
    background-color: $color-blue;
    animation-delay: -1s;
  }

  @keyframes sk-rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes sk-bounce {
    0%,
    100% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
  }
}
</style>