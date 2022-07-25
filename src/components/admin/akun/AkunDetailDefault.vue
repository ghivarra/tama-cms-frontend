<template>

  <div class="modal-content-body">
    <h1 class="h2 font-bold mb-6">{{ admin.nama }}</h1>
    <div class="mb-6 smartphone:flex">
      <button v-on:click="editData" type="button" class="btn text-white bg-primary hover:bg-primary-dark">Edit</button>
      <button v-on:click="toggleStatusData" type="button" v-bind:class="`btn mx-3 text-white ${statusColor}`">{{ statusText }}</button>
      <button v-on:click="deleteData" type="button" class="btn text-white bg-error hover:bg-error-dark">Hapus</button>
    </div>
    <p class="mb-2">{{ `Akun dibuat pada ${createdTime}` }}</p>
    <p>{{ `Terakhir diperbaharui pada ${updatedTime}` }}</p>
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
    name: 'akun-detail-default',
    props: ['admin', 'editData', 'toggle'],
    inject: ['changePreloadStatus', 'reloadTable'],
    computed: {
      updatedTime: function() {
        let date = DateTime.fromSeconds(this.admin.date_update).setLocale("id").toLocaleString(DateTime.DATE_FULL);
        let time = DateTime.fromSeconds(this.admin.date_update).setLocale("id").toLocaleString(DateTime.TIME_24_SIMPLE);
        return `${date} - ${time}`;
      },
      createdTime: function() {
        let date = DateTime.fromSeconds(this.admin.date_create).setLocale("id").toLocaleString(DateTime.DATE_FULL);
        let time = DateTime.fromSeconds(this.admin.date_create).setLocale("id").toLocaleString(DateTime.TIME_24_SIMPLE);
        return `${date} - ${time}`;
      },
      statusColor: function() {
        return (this.admin.status == 'aktif') ? 'bg-warning hover:bg-warning-dark' : 'bg-success hover:bg-success-dark';
      },
      statusText: function() {
        return (this.admin.status == 'aktif') ? 'Nonaktifkan' : 'Aktifkan';
      }
    },
    methods: {
      deleteData: function() {

        this.changePreloadStatus();

        let app = this;
        let postData = new FormData();
        postData.append('adm_id', app.admin.adm_id);

        usePrivateApi('admin/delete', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            app.reloadTable();
            Swal.fire(data.title, data.message, data.status).then(() => {
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
        postData.append('adm_id', app.admin.adm_id);

        usePrivateApi('admin/update-status', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            app.reloadTable();
            Swal.fire(data.title, data.message, data.status).then(() => {
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