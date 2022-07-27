<template>
  <section>
    <div class="text-center">
      <img v-bind:src="imagePassword" class="block mx-auto mb-0" alt="Password Berhasil Dirubah">
      <h3 class="h3 font-bold mb-8">Password Baru Berhasil Disimpan</h3>
    </div>
  </section>
</template>

<script>

  import { imageURL } from '../../../../helper/Global';

  export default {
    name: 'form-sukses',
    data: function() {
      return {
        
      }
    },
    computed: {
      imagePassword: function() {
        return imageURL(`assets/etc/password-berubah.png?v=1.0&width=250&height=250`);
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>