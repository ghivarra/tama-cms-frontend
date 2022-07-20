<template>
  <Transition name="slide-fade-up">
    <form ref="modal" v-if="show" v-on:submit="updateProfile" v-on:click="checkToggle" class="modal pengaturan">

      <!-- MODAL CONTENT -->
      <div ref="modalDialog" class="modal-dialog">
        <div class="modal-content">
          <header class="modal-content-header flex justify-between items-center">
            <h2 class="h3 font-bold">Modul</h2>
            <button v-on:click="toggle" type="button" class="text-red-500 hover:text-red-600 transition-colors">
              <font-awesome icon="fa-solid fa-xmark" class="h3"></font-awesome>
            </button>
          </header>

          <div class="modal-content-body">
            
            PLIS MUNCUL BRAY

          </div>

          <footer class="modal-content-footer flex justify-end">
            <button v-on:click="toggle" type="button" class="btn text-white bg-gray-500 hover:bg-gray-600 w-full mr-2 tablet:w-auto">Tutup</button>
          </footer>

        </div><!-- /modal-content -->
      </div><!-- /modal-dialog -->
    </form>
  </Transition>
</template>

<script>

  // load functions
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  export default {
    name: 'modul-modal',
    props: ['show', 'toggle'],
    components: {
      'font-awesome': FontAwesomeIcon
    },
    methods: {
      checkToggle: function(e) {
        if (e.target == this.$refs.modal || e.target == this.$refs.modalDialog) {
          this.toggle();
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>