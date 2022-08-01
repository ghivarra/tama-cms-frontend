<template>

  <main role="main" class="min-h-screen w-100 flex items-center justify-center">
    
    <section class="p-10">
      <img class="max-w-full max-h-full mb-8" v-bind:src="imageError" alt="error 404 - not found">
      <p class="mb-8 text-center mx-auto" style="width: 250px">Maaf, halaman yang anda tuju tidak ditemukan.</p>
      <div class="flex items-center justify-center">
        <button v-on:click.prevent="$router.go(-1)" type="button" class="btn bg-gss hover:bg-gss-dark text-white mx-auto">
          <font-awesome icon="fa-solid fa-arrow-left" class="mr-1"></font-awesome>
          Kembali
        </button>
      </div>
    </section>

  </main>

</template>

<script>

  // load functions
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  export default {
    name: 'not-found',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    inject: ['changePreloadStatus', 'preloadStatus'],
    data: function() {
      return {
        imageError: require('../assets/image/error-404.png'),
      }
    },
    created: function() {
      if (this.preloadStatus) {
        this.changePreloadStatus();
      }
    },
    mounted: function() {
      if (this.preloadStatus) {
        this.changePreloadStatus();
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>