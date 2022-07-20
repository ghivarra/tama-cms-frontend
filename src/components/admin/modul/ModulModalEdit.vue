<template>
  
  <form v-on:submit.prevent="submitData">
    
    <section v-if="modulLoaded">
      MODUL LOADED
    </section>

    <section v-else>
      SKELLETON
    </section>

  </form>

</template>

<script>

  // load functions
  import { usePrivateApi } from '../../../helper/Api';

  export default {
    name: 'modul-modal-edit',
    props: ['data'],
    data: function() {
      return {
        modulLoaded: false,
        modul: {}
      }
    },
    methods: {
      submitData: function() {

      }
    },
    created: function() {

      let app = this;

      usePrivateApi(`sertifikasi/modul/select/${this.data.mod_id}`, {
        app: app,
        method: 'get',
        success: function(res) {
          console.log(res.data);
        }
      });
    }
  }

</script>