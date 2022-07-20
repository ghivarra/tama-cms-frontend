<template>
  
  <form v-on:submit.prevent="submitData">
    
    <section v-if="modulLoaded" class="modal-content-body">
      
      <div class="form-group mb-6">
        <label for="nama" class="font-bold">Nama Modul</label>
        <input v-model="modul.mod_nama" id="nama" type="text" class="form-modern" required>
      </div>

      <div class="form-group mb-6">
        <label for="status" class="font-bold block mb-2">Status</label>
        <select v-model="modul.mod_status" id="status" class="form-select" required>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

    </section>

    <section v-else class="modal-content-body">
      
      <div v-for="skeleton in skeletons" v-bind:key="skeleton" class="mb-6">
        <div class="label h-4 w-1/3 skeleton-loader mb-2"></div>
        <div class="input h-2 w-full skeleton-loader"></div>
      </div>

    </section>

    <footer class="modal-content-footer flex justify-end">
      <button v-on:click="toggle" type="button" class="btn text-white bg-gray-500 hover:bg-gray-600 w-full mr-2 tablet:w-auto">Tutup</button>
      <button type="submit" class="btn text-white bg-success hover:bg-success-dark">Simpan</button>
    </footer>

  </form>

</template>

<script>

  // load functions
  import { usePrivateApi } from '../../../helper/Api';

  // load library
  import Swal from 'sweetalert2';

  export default {
    name: 'modul-modal-edit',
    props: ['data', 'toggle'],
    inject: ['changePreloadStatus', 'reloadTable'],
    data: function() {
      return {
        modulLoaded: false,
        modul: {},

        // skelly boys
        skeletons: [1, 2]
      }
    },
    methods: {
      submitData: function() {
        let app = this;

        app.changePreloadStatus();

        let postData = new FormData();
        postData.append('mod_nama', app.modul.mod_nama);
        postData.append('mod_status', app.modul.mod_status);
        postData.append('mod_id', app.modul.mod_id);

        usePrivateApi('sertifikasi/modul/update', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            res = res.data;
            Swal.fire(res.title, res.message, res.status).then(() => {
              app.reloadTable();
              app.toggle();
            });
          },
          final: function() {
            app.changePreloadStatus();
          }
        });
      }
    },
    created: function() {

      let app = this;

      usePrivateApi(`sertifikasi/modul/select/${this.data.mod_id}`, {
        app: app,
        method: 'get',
        success: function(res) {
          app.modul = res.data.data;
          app.modulLoaded = true;
        }
      });
    }
  }

</script>