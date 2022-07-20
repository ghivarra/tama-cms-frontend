<template>
  <h1 class="h2 font-bold mb-6">{{ data.mod_nama }}</h1>
  <div class="mb-6 smartphone:flex">
    <button v-on:click="editData" type="button" class="btn text-white bg-primary hover:bg-primary-dark">Edit</button>
    <button type="button" v-bind:class="`btn mx-3 text-white ${statusColor}`">{{ statusText }}</button>
    <button type="button" class="btn text-white bg-error hover:bg-error-dark">Hapus</button>
  </div>
  <p class="mb-2">{{ `Modul dibuat pada ${createdTime} oleh ` }}<b>{{ data.creator }}</b></p>
  <p>{{ `Terakhir diperbaharui pada ${updatedTime} oleh ` }}<b>{{ data.updater }}</b></p>
</template>

<script>

  import { DateTime } from 'luxon';

  export default {
    name: 'modul-modal-default',
    props: ['data', 'editData'],
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
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
