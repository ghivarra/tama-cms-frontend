<template>

  <div class="modal-content-body">
    <h1 class="h2 font-bold mb-6">{{ data.mod_nama }}</h1>
    <div class="mb-6 smartphone:flex">
      <button v-on:click="editData" type="button" class="btn text-white bg-primary hover:bg-primary-dark">Edit</button>
      <button v-on:click="toggleStatusData" type="button" v-bind:class="`btn mx-3 text-white ${statusColor}`">{{ statusText }}</button>
      <button v-on:click="deleteData" type="button" class="btn text-white bg-error hover:bg-error-dark">Hapus</button>
    </div>
    <p class="mb-2">{{ `Modul dibuat pada ${createdTime} oleh ` }}<b>{{ data.creator }}</b></p>
    <p>{{ `Terakhir diperbaharui pada ${updatedTime} oleh ` }}<b>{{ data.updater }}</b></p>
  </div>

  <footer class="modal-content-footer flex justify-end">
    <button v-on:click="toggle" type="button" class="btn text-white bg-gray-500 hover:bg-gray-600 w-full mr-2 tablet:w-auto">Tutup</button>
  </footer>

</template>

<script>

  // load functions
  import { DateTime } from 'luxon';
  import { usePrivateApi } from '../../../helper/Api';

  // load library
  import Swal from 'sweetalert2';

  export default {
    name: 'modul-modal-default',
    props: ['data', 'editData', 'toggle'],
    inject: ['reloadTable', 'changePreloadStatus'],
    computed: {
      updatedTime: function() {
        let date = DateTime.fromSeconds(this.data.date_update).setLocale("id").toLocaleString(DateTime.DATE_FULL);
        let time = DateTime.fromSeconds(this.data.date_update).setLocale("id").toLocaleString(DateTime.TIME_24_SIMPLE);
        return `${date} - ${time}`;
      },
      createdTime: function() {
        let date = DateTime.fromSeconds(this.data.date_create).setLocale("id").toLocaleString(DateTime.DATE_FULL);
        let time = DateTime.fromSeconds(this.data.date_create).setLocale("id").toLocaleString(DateTime.TIME_24_SIMPLE);
        return `${date} - ${time}`;
      },
      statusColor: function() {
        return (this.data.status == 'aktif') ? 'bg-warning hover:bg-warning-dark' : 'bg-success hover:bg-success-dark';
      },
      statusText: function() {
        return (this.data.status == 'aktif') ? 'Nonaktifkan' : 'Aktifkan';
      }
    },
    methods: {
      deleteData: function() {

        this.changePreloadStatus();

        let app = this;
        let postData = new FormData();
        postData.append('mod_id', app.data.mod_id);

        usePrivateApi('sertifikasi/modul/delete', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire(data.title, data.message, data.status).then(() => {
              app.reloadTable();
              app.toggle();
            });
          },
          final: function() {
            app.changePreloadStatus();
          }
        });

      },
      toggleStatusData: function() {

        this.changePreloadStatus();

        let app = this;
        let postData = new FormData();
        postData.append('mod_id', app.data.mod_id);

        usePrivateApi('sertifikasi/modul/status-update', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire(data.title, data.message, data.status).then(() => {
              app.reloadTable();
              app.toggle();
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
