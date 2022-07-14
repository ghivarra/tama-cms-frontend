<template>
    <div id="appBody" class="text-neutral-800">
      <router-view v-bind:key="$route.fullPath"></router-view>
    </div>
</template>

<script>

export default {
  name: 'App'
}

</script>

<style lang="scss">

/* import font  */
@import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

html, body { font-size: 18px; font-family: 'Rubik', sans-serif; }

.h {

  &1 {
    font-size: 1.5rem;
  }

  &2 {
    font-size: 1.25rem;
  }

  &3 {
    font-size: 1.1rem;
  }
}

.v-enter-active, .v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from, .v-leave-to {
  opacity: 0;
}

.skeleton-loader {
  position: relative;
  overflow: hidden;
  background-color: #DDDBDD;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 1.5s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
}

</style>