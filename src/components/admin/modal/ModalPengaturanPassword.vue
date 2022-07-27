<template>
  <Transition name="slide-fade-up">
    <form ref="modal" v-if="show" v-on:submit="updateProfile" v-on:click="checkToggle" class="modal pengaturan">
      <!-- MODAL CONTENT -->
      <div ref="modalDialog" class="modal-dialog">
        <div class="modal-content">
          <header class="modal-content-header flex justify-between items-center">
            <h2 class="h3 font-bold">Ubah Password</h2>
            <button v-on:click="extraToggle" type="button" class="text-red-500 hover:text-red-600 transition-colors">
              <font-awesome icon="fa-solid fa-xmark" class="h3"></font-awesome>
            </button>
          </header>

          <div class="modal-content-body no-footer">
            
            <section class="indicator flex justify-center items-start pt-4 mb-8">
              
              <div v-for="indicator in indicators" v-bind:key="indicator.step">
                <div v-bind:class=" `indicator-item ${indicator.status}` ">
                  <div class="indicator-line"></div>
                  <div class="indicator-dot">
                    <font-awesome v-if="indicator.status == 'done'" icon="fa-solid fa-circle-check" class="text-green-500 h-full w-full bg-white"></font-awesome>
                  </div>
                  <div class="indicator-line"></div>
                </div>
                <p class="indicator-title">{{ indicator.text }}</p>
              </div>

            </section>

            <section class="indicator-form">
              <component v-bind:is="activeComponent" v-bind:key="activeComponentID" v-bind:nextStep="nextStep"></component>
            </section>

            <div role="alert" class="bg-warning-light text-info text-center px-6 py-4 rounded-md shadow-sm mb-8">Jangan menutup jendela perubahan password sebelum langkah perubahan selesai</div>

          </div>

        </div><!-- /modal-content -->
      </div><!-- /modal-dialog -->
    </form>
  </Transition>
</template>

<script>

  // load functions
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { markRaw, defineAsyncComponent } from 'vue';

  // data default
  const defaultActiveComponent = markRaw(defineAsyncComponent(() => {
    return import(`./password/FormPerubahan.vue`);
  }));
  const defaultActiveComponentID = 1;

  export default {
    name: 'modal-pengaturan-akun',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    props: [
      'show', 
      'toggle'
    ],
    inject: [
      'admin',
      'adminLoaded',
      'updateDataAdmin',
      'getProfilePicture',
    ],
    data: function() {
      return {
        activeComponentID: defaultActiveComponentID,
        activeComponent: defaultActiveComponent,
        indicators: [
          { step: 1, text: 'Isi Kolom Perubahan', status: 'active', component: 'FormPerubahan' },
          { step: 2, text: 'Konfirmasi OTP', status: 'inactive', component: 'FormOtp' },
          { step: 3, text: 'Password Dirubah', status: 'inactive', component: 'FormSukses' }
        ],
        data: {
          nama: this.admin.nama,
          foto: undefined
        }
      }
    },
    watch: {
      admin: function(admin) {
        this.data.nama = admin.adm_nama;
      }
    },
    methods: {
      checkToggle: function(e) {
        if (e.target == this.$refs.modal || e.target == this.$refs.modalDialog) {
          this.extraToggle();
        }
      },
      getCurrentStep: function() {
        let app = this;
        Array.prototype.forEach.call(app.indicators, (item) => {
          if (item.status == 'active') {
            app.activeComponent = markRaw(item.component);
          }
        });
      },
      nextStep: function() {
        let app = this;
        let next;
        for (var i = 0; i < app.indicators.length; i++) {
          if (app.indicators[i].status == 'active') {
            next = i + 1;
            app.indicators[i].status = 'done';

            if (app.indicators[next] != undefined) {
              app.indicators[next].status = (app.indicators[next + 1] == undefined) ? 'done' : 'active';
              app.activeComponent = markRaw(defineAsyncComponent(() => {
                return import(`./password/${app.indicators[next].component}.vue`);
              }));
              app.activeComponentID = app.indicators[next].step;
              break;
            }

          }
        }
      },
      extraToggle: function() {
        
        // defaulted
        this.indicators = [
          { step: 1, text: 'Isi Kolom Perubahan', status: 'active', component: 'FormPerubahan' },
          { step: 2, text: 'Konfirmasi OTP', status: 'inactive', component: 'FormOtp' },
          { step: 3, text: 'Password Dirubah', status: 'inactive', component: 'FormSukses' }
        ];
        this.activeComponent = defaultActiveComponent;
        this.activeComponentID = defaultActiveComponentID;

        this.toggle();
      }
    },
    created: function() {
      if (this.admin.adm_nama != undefined) {
        this.data.nama = this.admin.adm_nama;
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .indicator {

    &-dot {
      width: 20px;
      height: 20px;
    }

    &-line {
      width: 40px;
      height: 4px;
    }

    &-title {
      width: 100px;
      padding: 0 10px;
    }
  }

  @media (min-width: 650px) {
    .indicator {

      &-dot {
        width: 30px;
        height: 30px;
      }

      &-line {
        width: 55px;
        height: 4px;
      }

      &-title {
        width: 140px;
        padding: 0 20px;
      }
    }
  }

</style>