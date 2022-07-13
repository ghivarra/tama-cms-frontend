<template>
  <div v-if="preloadStatus" id="preloader" class="flex justify-center items-center h-screen w-screen fixed z-50 top-0 left-0 bg-white opacity-80">
    <img v-bind:src="preloader">
  </div>
</template>

<script>

import { baseURL } from '../helper/Global';

export default {
  name: 'global-preloader',
  props: ['preloadStatus'],
  computed: {
    preloader: function() {
      return baseURL('assets/image/wahana-preloader.gif?v=1.0');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>