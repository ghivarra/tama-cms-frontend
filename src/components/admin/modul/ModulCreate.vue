<template>
  <Transition name="slide-fade-up">
    <section ref="modal" v-if="show" v-on:click="checkToggle" class="modal pengaturan">

      <!-- MODAL CONTENT -->
      <div ref="modalDialog" class="modal-dialog">
        <div class="modal-content">
          <header class="modal-content-header bg-gss-dark text-white flex justify-between items-center tablet:bg-white tablet:text-dark">
            <h2 class="h3 font-bold">Buat Modul</h2>
            <button v-on:click="toggle" type="button" class="text-red-500 hover:text-red-600 transition-colors">
              <font-awesome icon="fa-solid fa-xmark" class="h3"></font-awesome>
            </button>
          </header>

          <form v-on:submit.prevent="submitData">
    
            <section class="modal-content-body">
              
              <div class="form-group mb-6">
                <label for="nama" class="font-bold">Nama Modul</label>
                <input v-model="data.mod_nama" id="nama" type="text" class="form-modern" required>
              </div>

              <div class="form-group mb-6">
                <label for="status" class="font-bold block mb-2">Status</label>
                <select v-model="data.mod_status" id="status" class="form-select" required>
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

  export default {
    name: 'modul-create',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    props: ['toggle', 'show'],
    inject: ['reloadTable', 'changePreloadStatus'],
    data: function() {
      return {
        data: {
          mod_nama: '',
          mod_status: 'aktif'
        },
        stay: false
      }
    },
    methods: {
      checkToggle: function(e) {
        if (e.target == this.$refs.modal || e.target == this.$refs.modalDialog) {
          this.toggle();
        }
      },
      submitData: function() {
        this.changePreloadStatus();
        
        let app = this;
        let postData = new FormData();
        Object.keys(app.data).forEach((key) => {
          postData.append(key, app.data[key]);
        });

        usePrivateApi('modul/create', {
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
    }
  }

</script>