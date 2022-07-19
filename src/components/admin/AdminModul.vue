<template>
  <main role="main" class="px-8 py-6">
    
    <header class="block mb-8 smartphone:flex smartphone:items-center smartphone:justify-between">
      
      <button type="button" class="btn mb-6 block text-white shadow-md bg-success hover:bg-success-dark smartphone:mb-0">
        <font-awesome icon="fa-solid fa-plus" class="mr-1"></font-awesome>
        Tambah Modul
      </button>

      <section class="table-navigator flex items-center">
        
        <button disabled v-on:click="previousPage" ref="navPrev" type="button" class="btn nav rounded-full shadow-md text-dark bg-white hover:bg-gss-light hover:text-white focus:bg-gss-dark focus:text-white disabled:bg-gray-200 disabled:text-dark">
          <font-awesome icon="fa-solid fa-chevron-left"></font-awesome>
        </button>

        <input disabled v-model="datatableCurrentPage" ref="navPage" type="number" class="btn mx-3 page shadow-md text-dark bg-white focus:outline-none disabled:bg-gray-200 disabled:text-dark" min="1">

        <button disabled v-on:click="nextPage" ref="navNext" type="button" class="btn nav rounded-full shadow-md text-dark bg-white hover:bg-gss-light hover:text-white focus:bg-gss-dark focus:text-white disabled:bg-gray-200 disabled:text-dark">
          <font-awesome icon="fa-solid fa-chevron-right"></font-awesome>
        </button>

      </section>

    </header>

    <section class="w-full overflow-auto pb-4">

      <table id="table" class="table-auto rounded-sm overflow-hidden shadow-md">
    
        <thead class="border-none bg-gss-dark text-white">

          <tr>
            <th class="text-center py-4 pl-4 pr-2 admin-table-search-label" colspan="2">Kolom Pencarian:</th>
            <th class="py-4 px-2">
              <input disabled v-on:input="dtSearch" type="search" data-field="2" class="form-control admin-table-search">
            </th>
            <th class="py-4 px-2">
              <input disabled v-on:input="dtSearch" type="search" data-field="3" class="form-control admin-table-search">
            </th>
            <th class="py-4 pl-2 pr-4">
              <date-picker v-model="dateSrc" v-bind:enableTimePicker="false" v-bind:autoApply="true" v-bind:closeOnScroll="true" inputClassName="text-dark font-normal" format="dd-MM-yyyy" locale="id-ID" selectText="Pilih" cancelText="Batal" placeholder="Pilih Tanggal"></date-picker>
            </th>
          </tr>

          <tr>
            <th class="text-center py-4 pl-4 pr-2"></th>
            <th class="text-center py-4 px-2">No.</th>
            <th class="py-4 px-2">Nama Modul</th>
            <th class="py-4 px-2">Status</th>
            <th class="py-4 pl-2 pr-4">Waktu Pembuatan</th>
          </tr>
        </thead>

        <tbody id="tableBody" class="bg-white"></tbody>

        <tfoot class="border-none bg-gss-dark text-white">
          <tr>
            <th class="py-4 pl-4 pr-2"></th>
            <th class="text-center py-4 px-2">No.</th>
            <th class="py-4 px-2">Nama Modul</th>
            <th class="py-4 px-2">Status</th>
            <th class="py-4 pl-2 pr-4">Waktu Pembuatan</th>
          </tr>
        </tfoot>

      </table>

    </section>

    <div id="tableSkeleton" class="hidden">
      <tr v-for="(skeleton, n) in skeletons" v-bind:key="n" class="border-b w-full">
        <td class="py-4 pl-4 pr-2 text-center">
          <div class="skeleton-loader rounded-full mx-auto" style="width: 16px; height: 16px;"></div>
        </td>
        <td class="py-4 px-2 text-center">
          <div class="skeleton-loader rounded-full mx-auto" style="width: 16px; height: 16px;"></div>
        </td>
        <td class="py-4 px-2">
          <div class="skeleton-loader w-full" style="height: 16px;"></div>
        </td>
        <td class="py-4 px-2">
          <div class="skeleton-loader w-full" style="height: 16px;"></div>
        </td>
        <td class="py-4 pl-2 pr-4">
          <div class="skeleton-loader w-full" style="height: 16px;"></div>
        </td>
      </tr>
    </div>

  </main>
</template>

<script>

  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { imageURL } from '../../helper/Global';

  // load library
  import $ from 'jquery';
  import Swal from 'sweetalert2';
  import Datepicker from '@vuepic/vue-datepicker';

  // eslint-disable-next-line no-unused-vars
  import DataTable from 'datatables.net-dt';

  export default {
    name: 'admin-modul',
    components: {
      'font-awesome': FontAwesomeIcon,
      'date-picker': Datepicker
    },
    data: function() {
      return {
        tableLoaded: false,
        skeletons: [1, 2, 3, 4, 5, 6, 7, 8],
        datatable: false,
        datatableCurrentPage: 1,
        datatableMaxPage: null,

        // src data
        timeout: undefined,
        dateSrc: '',
        dateSrcField: 4
      }
    },
    watch: {
      datatableCurrentPage: function(newPage) {
        if (newPage.length < 1) {
          return;
        }

        if (newPage > this.datatableMaxPage) {
          Swal.fire('Peringatan', 'Tidak ada data untuk ditampilkan', 'warning');
          return;
        }

        let pageTo = parseInt(newPage) - 1;
        this.datatable.page(pageTo).draw('page');
      },
      dateSrc: function(newDate) {
        let app = this;

        if (newDate == null || newDate.length < 1) {
          app.datatable.column(app.dateSrcField).search('').draw();
          return;
        }

        // delay
        if (app.timeout) {
          clearTimeout(app.timeout);
        }

        app.timeout = setTimeout(function(){
          app.datatable.column(app.dateSrcField).search(newDate).draw();
        }, 400);
      }
    },
    methods: {
      nextPage: function() {
        this.datatable.page('next').draw('page');
      },
      previousPage: function() {
        this.datatable.page('previous').draw('page');
      },
      dtSearch: function(e) {
        let el = e.target;
        let app = this;

        // delay
        if (app.timeout) {
          clearTimeout(app.timeout);
        }

        app.timeout = setTimeout(function(){
          let field = parseInt(el.getAttribute('data-field'));
          app.datatable.column(field).search(el.value).draw();
        }, 400);
      }
    },
    mounted: function() {

      let app = this;
      let skeleton = $('#tableSkeleton').html();

      app.datatable = $('#table').DataTable({
        serverSide: true,
        order: [[2, 'asc']],
        pageLength: 5,
        ajax: {
          url: `${process.env.VUE_APP_API_BASE_URL}sertifikasi/modul/datatable`,
          type: 'get',
          xhrFields: {
            withCredentials: true
          },
          dataSrc: function(json) {
            let data = json.data;

            if (data.length > 0) {
              Array.prototype.forEach.call(data, function(item, i){
                var color = (item.mod_status == 'aktif') ? 'text-success' : 'text-error';
                data[i].mod_status = `<span class="${color} font-bold">${item.mod_status}</span>`; 
              });
            }

            return data;
          }
        },
        language: {
          url: imageURL('packages/indonesia.json?v=1.3-beta')
        },
        preDrawCallback: function() {
          app.tableLoaded = false;
          app.$refs.navPage.disabled = true;
          $('#tableBody').html(skeleton);
          $('.admin-table-search').prop('disabled', true);
        },
        drawCallback: function() {
          app.datatableCurrentPage = parseInt(app.datatable.page.info().page) + 1;
          app.tableLoaded = true;
          app.$refs.navPage.disabled = false;
          app.datatableMaxPage = app.datatable.page.info().pages;
          $('.admin-table-search').prop('disabled', false);

          if (app.datatableCurrentPage == 1) {
            app.$refs.navPrev.disabled = true;
            app.$refs.navNext.disabled = false;
          } else if (app.datatableCurrentPage == app.datatableMaxPage) {
            app.$refs.navNext.disabled = true;
            app.$refs.navPrev.disabled = false;
          } else {
            app.$refs.navPrev.disabled = false;
            app.$refs.navPrev.disabled = false;
          }
        },
        columns: [
              { data: null, className: 'dt-control admin-table-control', orderable: false, defaultContent: '' },
              { data: "no", className: 'admin-table-number text-center', orderable: false },
              { data: "mod_nama" },
              { data: "mod_status", className: 'admin-table-status capitalize' },
              { data: "mod_created_at", className: 'admin-table-time'}
        ]
      });
    },
    beforeUnmount: function() {
      if (this.datatable) {
        this.datatable.destroy();
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .table-navigator {

    .page {
      width: 100px;
    }

    .nav {
      max-width: 40px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  }

  table.dataTable {

    width: 100% !important;
    min-width: 1000px;

    .admin-table-number, .admin-table-search-label {
      text-align: center;
    }

    .admin-table-time {
      max-width: 150px;
    }

    .admin-table-status {
      max-width: 80px;
    }
  }

  .pr-2 {
    padding-right: 0.5rem;
  }
  .pl-4 {
    padding-left: 1rem;
  }
  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

</style>