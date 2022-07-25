<template>
  <Transition name="slide-fade-up">
    <section ref="modal" v-if="show" v-on:click="checkToggle" class="modal pengaturan">

      <!-- MODAL CONTENT -->
      <div ref="modalDialog" class="modal-dialog">
        <div class="modal-content">
          <header class="modal-content-header bg-gss-dark text-white flex justify-between items-center tablet:bg-white tablet:text-dark">
            <h2 class="h3 font-bold">Detail Role</h2>
            <button v-on:click="extraToggle" type="button" class="text-red-500 hover:text-red-600 transition-colors">
              <font-awesome icon="fa-solid fa-xmark" class="h3"></font-awesome>
            </button>
          </header>

          <!-- LOAD COMPONENT -->
          <component v-bind:is="currentModalComponent" v-bind:editData="editData" v-bind:role="role" v-bind:toggle="extraToggle"></component>

        </div><!-- /modal-content -->
      </div><!-- /modal-dialog -->
    </section>
  </Transition>
</template>

<script>

  // load functions
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { markRaw, defineAsyncComponent } from 'vue';

  export default {
    name: 'role-detail',
    props: ['show', 'toggle', 'role'],
    components: {
      'font-awesome': FontAwesomeIcon
    },
    data: function() {
      return {
        currentModalComponent: markRaw(defineAsyncComponent(() => {
          return import(`./RoleDetailDefault.vue`);
        }))
      }
    },
    computed: {
      modul: function() {
        return this.data[this.instance];
      }
    },
    methods: {
      checkToggle: function(e) {
        if (e.target == this.$refs.modal || e.target == this.$refs.modalDialog) {
          this.extraToggle();
        }
      },
      extraToggle: function() {
        this.currentModalComponent = markRaw(defineAsyncComponent(() => {
          return import(`./RoleDetailDefault.vue`);
        }));
        this.toggle();
      },
      editData: function() {
        this.currentModalComponent = markRaw(defineAsyncComponent(() => {
          return import(`./RoleDetailEdit.vue`);
        }))
      }
    }
  }

</script>