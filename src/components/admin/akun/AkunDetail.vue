<template>
  <Transition name="slide-fade-up">
    <section ref="modal" v-if="show" v-on:click="checkToggle" class="modal pengaturan">

      <!-- MODAL CONTENT -->
      <div ref="modalDialog" class="modal-dialog">
        <div class="modal-content">
          <header class="modal-content-header bg-gss-dark text-white flex justify-between items-center tablet:bg-white tablet:text-dark">
            <h2 class="h3 font-bold">Detail Akun</h2>
            <button v-on:click="extraToggle" type="button" class="text-red-500 hover:text-red-600 transition-colors">
              <font-awesome icon="fa-solid fa-xmark" class="h3"></font-awesome>
            </button>
          </header>

          <!-- LOAD COMPONENT -->
          <component v-bind:edit-data="editData" v-bind:is="currentModalComponent" v-bind:admin="admin" v-bind:toggle="extraToggle" v-bind:update-menu="updateMenu"></component>

        </div><!-- /modal-content -->
      </div><!-- /modal-dialog -->
    </section>
  </Transition>
</template>

<script>

  // load functions
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { markRaw, defineAsyncComponent } from 'vue';
  import { usePrivateApi } from '../../../helper/Api';

  export default {
    name: 'akun-detail',
    props: ['show', 'toggle', 'admin'],
    inject: ['updateMenuData'],
    components: {
      'font-awesome': FontAwesomeIcon
    },
    data: function() {
      return {
        currentModalComponent: markRaw(defineAsyncComponent(() => {
          return import(`./AkunDetailDefault.vue`);
        }))
      }
    },
    computed: {
      modul: function() {
        return this.data[this.instance];
      }
    },
    methods: {
      updateMenu: function() {
        let app = this;
        usePrivateApi('menu-list', {
          app: app,
          method: 'get',
          success: function(response) {
            app.updateMenuData(response.data.data, app.$route.path);
          }
        });
      },
      checkToggle: function(e) {
        if (e.target == this.$refs.modal || e.target == this.$refs.modalDialog) {
          this.extraToggle();
        }
      },
      extraToggle: function() {
        this.currentModalComponent = markRaw(defineAsyncComponent(() => {
          return import(`./AkunDetailDefault.vue`);
        }));
        this.toggle();
      },
      editData: function() {
        this.currentModalComponent = markRaw(defineAsyncComponent(() => {
          return import(`./AkunDetailEdit.vue`);
        }))
      }
    }
  }

</script>