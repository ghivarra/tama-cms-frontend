<template>
  <Transition name="slide-fade-up">
    <section ref="modal" v-show="show" v-on:click="checkToggle" class="modal pengaturan">

      <!-- MODAL CONTENT -->
      <div ref="modalDialog" class="modal-dialog">
        <div class="modal-content">
          <header class="modal-content-header bg-gss-dark text-white flex justify-between items-center tablet:bg-white tablet:text-dark">
            <h2 class="h3 font-bold">Buat Role</h2>
            <button v-on:click="toggle" type="button" class="text-red-500 hover:text-red-600 transition-colors">
              <font-awesome icon="fa-solid fa-xmark" class="h3"></font-awesome>
            </button>
          </header>

          <form ref="form" v-on:submit.prevent="submitData">
    
            <section class="modal-content-body">
              
              <div class="form-group mb-6">
                <label for="nama" class="font-bold">Nama Role</label>
                <input v-model="data.rol_nama" id="nama" type="text" class="form-modern" required>
              </div>

              <div class="form-group mb-6">
                <div class="font-bold mb-2 block">Modul Aktif</div>
                <select ref="modules" id="modules" v-model="data.rol_modul" class="tom-selected" multiple></select>
              </div>

              <div class="form-group mb-6">
                <div class="font-bold mb-2 block">Menu Aktif</div>
                <select ref="menus" id="menus" v-model="data.rol_menu" class="tom-selected" multiple></select>
              </div>

              <div class="form-group mb-6">
                <div class="font-bold block mb-2">Status</div>
                <select v-model="data.rol_status" id="status" class="form-select" required>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              <div class="form-group flex items-center">
                <input v-model="stay" id="stayHere" type="checkbox" class="mr-2">
                <label for="stayHere">Tahan Jendela Pembuatan</label>
              </div>

            </section>

            <footer class="modal-content-footer flex justify-end">
              <button v-on:click="toggle" type="button" class="btn text-white bg-gray-500 hover:bg-gray-600 w-full mr-2 tablet:w-auto">Tutup</button>
              <button type="submit" class="btn text-white bg-success hover:bg-success-dark">Simpan</button>
            </footer>

          </form>
          

        </div><!-- /modal-content -->
      </div><!-- /modal-dialog -->
    </section>
  </Transition>
</template>

<script>

  // load functions
  import { usePrivateApi } from '../../../helper/Api';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  // load library
  import Swal from 'sweetalert2';
  import TomSelect from 'tom-select';

  export default {
    name: 'role-create',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    props: ['toggle', 'show'],
    inject: ['reloadTable', 'changePreloadStatus', 'allMenu', 'allModul'],
    data: function() {
      return {
        data: {
          rol_nama: '',
          rol_status: 'aktif',
          rol_modul: [],
          rol_menu: []
        },
        stay: false,
        tomSelected: false,

        tomSelect: {
          modul: null,
          menu: null
        }
      }
    },
    watch: {
      show: function(tampil) {

        if (!tampil) {
          this.tomSelect.modul.destroy();
          this.tomSelect.menu.destroy();
          this.tomSelect.modul = null;
          this.tomSelect.menu = null;
          
          this.data = {
            rol_nama: '',
            rol_status: 'aktif',
            rol_modul: [],
            rol_menu: []
          };
        }

      }
    },
    computed : {
      modalClass: function() {
        return (this.show) ? 'modal pengaturan' : 'modal pengaturan hidden';
      }
    },
    methods: {
      checkToggle: function(e) {
        if (e.target == this.$refs.modal || e.target == this.$refs.modalDialog) {
          this.toggle();
        }
      },
      useTomSelect: function() {

        let mod = document.getElementById('modules');
        let men = document.getElementById('menus');
        let app = this;

        if (mod != undefined && men != undefined) {

          // make data
          let modulesOption = [];
          let menusOption = [];

          Array.prototype.forEach.call(this.allModul, (item) => {
            modulesOption.push({
              value: item.mod_id,
              text: item.mod_nama
            });
          });

          Array.prototype.forEach.call(this.allMenu, (item) => {
            menusOption.push({
              value: item.men_id,
              text: item.men_nama
            });
          });

          this.tomSelect.modul = new TomSelect('#modules',{
            plugins: {
              remove_button:{
                title:'Hapus Modul',
              }
            },
            options: modulesOption,
            items: app.data.rol_modul,
            persist: false,
            create: false,
            maxOptions: null,
            onDelete: function() {
              return true;
            }
          });

          this.tomSelect.menu = new TomSelect('#menus',{
            plugins: {
              remove_button:{
                title:'Hapus Menu',
              }
            },
            options: menusOption,
            items: app.data.rol_menu,
            persist: false,
            create: false,
            maxOptions: null,
            onDelete: function() {
              return true;
            }
          });

          this.tomSelected = true;
        }
      },
      submitData: function() {

        this.changePreloadStatus();
        
        let app = this;
        let postData = new FormData();
        Object.keys(app.data).forEach((key) => {
          if (Array.isArray(app.data[key])) {
            postData.append(key, JSON.stringify(app.data[key]));
          } else {
            postData.append(key, app.data[key]);
          }
        });

        usePrivateApi('role/create', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire(data.title, data.message, data.status).then(() => {
              app.reloadTable();
              if (!app.stay) {
                app.toggle();
              }
            });
          },
          final: function() {
            app.changePreloadStatus();
          }
        });

      }
    },
    mounted: function() {
      if (this.show) {
        this.useTomSelect();
      }
    },
    updated: function() {
      if (this.show) {
        this.useTomSelect();
      }
    }
  }

</script>

<style lang="scss">

  @import '../../../../node_modules/tom-select/dist/scss/tom-select.scss';

  .tom-selected {

    .ts-control {
      font-size: 1rem;
      padding: 10px 12px;
    }
  }

  .ts-wrapper.multi.has-items {
      
    .ts-control {
      padding: 10px 12px;
    }

    .item {
      padding: 4px 0 4px 8px !important;
      margin-right: 8px;
    }
  }

</style>