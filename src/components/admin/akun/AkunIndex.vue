<template>
  <main role="main" class="px-8 py-10">
    
    <header class="block mb-8 flex items-center justify-between">
      
      <button v-on:click="createToggle" type="button" class="btn block text-white shadow-md bg-success hover:bg-success-dark smartphone:mx-0 smartphone:mb-0">
        <font-awesome icon="fa-solid fa-plus" class="smartphone:mr-2"></font-awesome>
        <span class="hidden smartphone:inline-block">Tambah</span>
      </button>

      <section class="table-navigator justify-center flex items-center">
        
        <button disabled v-on:click="previousPage" ref="navPrev" type="button" class="btn nav rounded-full shadow-md text-dark bg-white hover:bg-gss-light hover:text-white focus:bg-gss-dark focus:text-white disabled:bg-gray-200 disabled:text-dark">
          <font-awesome icon="fa-solid fa-chevron-left"></font-awesome>
        </button>

        <input disabled v-model="datatableCurrentPage" ref="navPage" type="number" class="btn mx-3 page shadow-md text-dark bg-white focus:outline-none disabled:bg-gray-200 disabled:text-dark" min="1">

        <button disabled v-on:click="nextPage" ref="navNext" type="button" class="btn nav rounded-full shadow-md text-dark bg-white hover:bg-gss-light hover:text-white focus:bg-gss-dark focus:text-white disabled:bg-gray-200 disabled:text-dark">
          <font-awesome icon="fa-solid fa-chevron-right"></font-awesome>
        </button>

      </section>

    </header>

    <section class="w-full rounded-sm overflow-hidden pb-4">

      <table id="table" class="table-auto rounded-sm shadow-md">
    
        <thead class="border-none bg-gss-dark text-white">

          <tr>
            <th class="text-center py-4 pl-4 pr-2 admin-table-search-label" colspan="2">Kolom Pencarian:</th>
            <th class="py-4 px-2">
              <input disabled v-on:input="dtSearch" type="search" data-field="2" class="form-control admin-table-search">
            </th>
            <th class="py-4 px-2">
              <select disabled v-on:input="dtSearch" data-field="3" class="form-select admin-table-search">
                <option value=""></option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </th>
            <th class="py-4 pl-2 pr-4">
              <date-picker v-model="dateSrc" v-bind:modelType="dateSrcFormat" v-bind:enableTimePicker="false" v-bind:autoApply="true" v-bind:closeOnScroll="true" v-bind:format="dateSrcFormat" inputClassName="text-dark font-normal" locale="id-ID" selectText="Pilih" cancelText="Batal" placeholder="Pilih Tanggal"></date-picker>
            </th>
          </tr>

          <tr>
            <th class="text-center py-4 pl-4 pr-2"></th>
            <th class="text-center py-4 px-2">No.</th>
            <th class="py-4 px-2">Akun</th>
            <th class="py-4 px-2">Status</th>
            <th class="py-4 pl-2 pr-4">Waktu Pembuatan</th>
          </tr>
        </thead>

        <tbody id="tableBody" class="bg-white"></tbody>

      </table>

    </section>

    <div id="tableSkeleton" class="hidden">
      <tr v-for="(skeleton, n) in skeletons" v-bind:key="n" class="border-b w-full">
        <td class="py-8 pl-6 pr-4 text-center">
          <div class="skeleton-loader rounded-full mx-auto" style="width: 16px; height: 16px;"></div>
        </td>
        <td class="py-8 px-4 text-center">
          <div class="skeleton-loader rounded-full mx-auto" style="width: 16px; height: 16px;"></div>
        </td>
        <td class="py-8 px-4">
          <div class="skeleton-loader w-full" style="height: 16px;"></div>
        </td>
        <td class="py-8 px-4">
          <div class="skeleton-loader w-full" style="height: 16px;"></div>
        </td>
        <td class="py-8 pl-4 px-6">
          <div class="skeleton-loader w-full" style="height: 16px;"></div>
        </td>
      </tr>
    </div>

    <div id="faSearch" class="hidden">
      <font-awesome icon="fa-solid fa-magnifying-glass" class="mr-2"></font-awesome>
    </div>

  </main>

  <!-- MODALS -->

</template>

<script>

  // load functions
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  // import { usePrivateApi } from '../../../helper/Api';
  import { imageURL, createModal, range } from '../../../helper/Global';
  import { DateTime } from 'luxon';
  import { computed } from 'vue';

  // load components
  // import RoleCreate from './RoleCreate.vue';
  // import RoleDetail from './RoleDetail.vue';

  // load library
  import $ from 'jquery';
  import Swal from 'sweetalert2';
  import Datepicker from '@vuepic/vue-datepicker';

  // import only library
  import 'datatables.net-dt';

  export default {
    name: 'akun-index',
    components: {
      'font-awesome': FontAwesomeIcon,
      'date-picker': Datepicker
    },
    data: function() {
      return {
        skeletons: range(10),
        tableLoaded: false,
        datatable: false,
        datatableCurrentPage: 1,
        datatableCurrentData: {},
        datatableMaxPage: 0,

        // src data
        timeout: undefined,
        dateSrc: '',
        dateSrcField: 4,
        dateSrcFormat: 'dd-MM-yyyy',

        // modal data
        detailStatus: false,
        detailKey: 0,

        // create data
        createStatus: false,
      }
    },
    computed: {
      akunDetail: function() {
        if (this.datatableCurrentData[this.detailKey] != undefined) {
          return this.datatableCurrentData[this.detailKey];
        } else {
          return {
            adm_nama: '',
            status: 'nonaktif',
            date_create: 0,
            date_update: 0
          }
        }
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
      },
      detailToggle: function() {
        createModal(this.detailStatus);
        this.detailStatus = !this.detailStatus;
      },
      createToggle: function() {
        createModal(this.createStatus);
        this.createStatus = !this.createStatus;
      },
      reloadTable: function() {
        this.datatable.draw();
      }
    },
    provide: function() {
      return {
        reloadTable: this.reloadTable,

        allMenu: computed(() => {
          return this.menus;
        }),
        allModul: computed(() => {
          return this.modules;
        })
      }
    },
    mounted: function() {

      let app = this;
      let skeleton = $('#tableSkeleton').html();

      // I use jquery so it will be easier LUL, for some delegation event like this jquery is KING!
      $('#table').on('click', '.control-btn', function(e){
        e.preventDefault();
        app.detailKey = $(this).attr('data-key');
        app.detailToggle();
      });

      app.datatable = $('#table').DataTable({
        serverSide: true,
        scrollY: false,
        scrollX: true,
        scrollCollapse: true,
        order: [[2, 'asc']],
        pageLength: 10,
        ajax: {
          url: `${process.env.VUE_APP_API_BASE_URL}/${process.env.VUE_APP_API_ADMIN_SLUG}/admin/datatable`,
          type: 'get',
          xhrFields: {
            withCredentials: true
          },
          dataSrc: function(json) {
            let data = json.data;

            // get icon
            let icon = document.getElementById('faSearch').innerHTML;

            if (data.length > 0) {
              Array.prototype.forEach.call(data, function(item, i){
                var color = (item.adm_status == 'aktif') ? 'text-success-calm bg-success-light' : 'text-error-calm bg-error-light';
                data[i].status = item.adm_status;
                data[i].adm_status = `<span class="${color} alert font-bold">${item.adm_status}</span>`; 

                // add aksi button
                data[i].aksi = `<button type="button" class="btn py-2 px-3 control-btn text-sm bg-primary hover:bg-primary-dark text-white" data-key="${i}">${icon}Detail</button>`;

                // set tanggal
                let date = DateTime.fromSeconds(item.date_create).setLocale("id").toLocaleString(DateTime.DATE_FULL);
                let time = DateTime.fromSeconds(item.date_create).setLocale("id").toLocaleString(DateTime.TIME_24_SIMPLE);
                data[i].adm_created_at = `${date} - ${time}`;

                // set pp
                let pic = (item.adm_foto == null || item.adm_foto.length < 1) ? 'placeholder.jpg' : item.adm_foto;
                pic = imageURL(`assets/photo/admin/${pic}?v=1.0&width=52&height=52`);

                // put on html
                let imgPic = `<img class="block border admin-table-image rounded-full mr-4" src="${pic}" alt="${item.adm_nama}">`;
                let adminInfo = `<div><p class="mb-1">${item.adm_nama}</p><p class="text-muted">${item.adm_email}</p></div>`;

                // put on admin info
                data[i].adm_nama = `<div class="flex">${imgPic}<div class="admin-table-info">${adminInfo}</div></div>`;
              });

            }

            // put to vue instance
            app.datatableCurrentData = data;

            return data;
          }
        },
        language: {
          url: imageURL('packages/indonesia.json?v=1.3-beta')
        },
        columns: [
              { data: "aksi", className: 'admin-table-control text-center', orderable: false, defaultContent: '' },
              { data: "no", className: 'admin-table-number text-center', orderable: false },
              { data: "adm_nama" },
              { data: "adm_status", className: 'admin-table-status capitalize' },
              { data: "adm_created_at", className: 'admin-table-time'}
        ],
        preDrawCallback: function() {
          app.tableLoaded = false;
          app.$refs.navPage.disabled = true;
          $('#tableBody').html(skeleton);
          $('.admin-table-search').prop('disabled', true);
        },
        drawCallback: function() {
          app.tableLoaded = true;
          app.datatableCurrentPage = parseInt(app.datatable.page.info().page) + 1;
          app.$refs.navPage.disabled = false;
          app.datatableMaxPage = app.datatable.page.info().pages;
          $('.admin-table-search').prop('disabled', false);

          if (app.datatableCurrentPage == 1 && app.datatableCurrentPage != app.datatableMaxPage) {
            app.$refs.navPrev.disabled = true;
            app.$refs.navNext.disabled = false;
          } else if (app.datatableCurrentPage == app.datatableMaxPage && app.datatableCurrentPage != 1) {
            app.$refs.navNext.disabled = true;
            app.$refs.navPrev.disabled = false;
          } else if (app.datatableMaxPage == 1) {
            app.$refs.navPrev.disabled = true;
            app.$refs.navNext.disabled = true;
          } else {
            app.$refs.navPrev.disabled = false;
            app.$refs.navNext.disabled = false;
          }
        }
      });
    },
    beforeUnmount: function() {
      if (this.datatable) {
        this.datatable.destroy();
      }
    }
  }

</script>

<style>
  #table .admin-table-info {
    width: calc(100% - 52px);
  }
  #table .admin-table-image {
    width: 52px;
  }
</style>