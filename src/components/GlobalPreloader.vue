<template>
  <div v-if="preloadStatus" id="preloader" class="flex justify-center items-center h-screen w-screen fixed z-50 top-0 left-0 bg-white opacity-80">
    <img v-bind:src="preloader">
  </div>
</template>

<script>

export default {
  name: 'global-preloader',
  props: ['preloadStatus'],
  computed: {
    preloader: function() {
      return require('../assets/image/preloader.gif');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>