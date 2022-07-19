<template>
  <main role="main" class="px-8 py-6">
    
    <header class="block mb-8 smartphone:flex smartphone:items-center smartphone:justify-between">
      
      <button type="button" class="btn mb-6 block text-white shadow-md bg-success hover:bg-success-dark smartphone:mb-0">
        <font-awesome icon="fa-solid fa-plus" class="mr-1"></font-awesome>
        Tambah Modul
      </button>

      <section class="table-navigator flex items-center">
        
        <button v-on:click="previousPage" ref="navPrev" type="button" class="btn nav rounded-full shadow-md text-dark bg-white hover:bg-gss-light hover:text-white focus:bg-gss-dark focus:text-white disabled:bg-gray-200 disabled:text-dark">
          <font-awesome icon="fa-solid fa-chevron-left"></font-awesome>
        </button>

        <input ref="navPage" type="number" class="btn mx-3 page shadow-md text-dark bg-white focus:outline-none disabled:bg-gray-200 disabled:text-dark" value="1" min="1">

        <button v-on:click="nextPage" ref="navNext" type="button" class="btn nav rounded-full shadow-md text-dark bg-white hover:bg-gss-light hover:text-white focus:bg-gss-dark focus:text-white disabled:bg-gray-200 disabled:text-dark">
          <font-awesome icon="fa-solid fa-chevron-right"></font-awesome>
        </button>

      </section>

    </header>

    <section>

      <table v-if="tableLoaded" class="table table-striped rounded-lg overflow-hidden">
      
        <thead class="border-none">
          <tr>
            <th class="text-center" colspan="2">Kolom Pencarian:</th>
            <th>
              <input type="search" data-field="2" class="form-control davion-table-search">
            </th>
            <th>
              <input type="search" data-field="3" class="form-control davion-table-search">
            </th>
            <th>
              <input type="search" data-toggle="datepicker" data-field="4" class="form-control davion-table-search">
            </th>
          </tr>
          <tr>
            <th></th>
            <th class="text-center">No.</th>
            <th>Nama Modul</th>
            <th>Status</th>
            <th>Waktu Pembuatan</th>
          </tr>
        </thead>

        <tbody></tbody>

        <tfoot class="border-none">
          <tr>
            <th></th>
            <th class="text-center">No.</th>
            <th>Nama Modul</th>
            <th>Status</th>
            <th>Waktu Pembuatan</th>
          </tr>
        </tfoot>

      </table>

      <div v-else>
        
        <table class="table-auto w-full rounded-md overflow-hidden shadow-md">
      
          <thead class="border-none bg-gss-dark text-white">

            <tr>
              <th class="text-center p-3" colspan="2">Kolom Pencarian:</th>
              <th class="p-3">
                <input type="search" data-field="2" class="form-control davion-table-search">
              </th>
              <th class="p-3">
                <input type="search" data-field="3" class="form-control davion-table-search">
              </th>
              <th class="p-3">
                <input type="search" data-toggle="datepicker" data-field="4" class="form-control davion-table-search">
              </th>
            </tr>

            <tr>
              <th></th>
              <th class="text-center p-3">No.</th>
              <th class="p-3">Nama Modul</th>
              <th class="p-3">Status</th>
              <th class="p-3">Waktu Pembuatan</th>
            </tr>
          </thead>

          <tbody class="bg-white">
            
            <tr v-for="(skeleton, n) in skeletons" v-bind:key="n" class="border-b w-full">
              <td class="py-4 px-3 text-center">
                <div class="skeleton-loader rounded-full mx-auto" style="width: 16px; height: 16px;"></div>
              </td>
              <td class="py-4 px-3 text-center">
                <div class="skeleton-loader rounded-full mx-auto" style="width: 16px; height: 16px;"></div>
              </td>
              <td class="py-4 px-3">
                <div class="skeleton-loader w-full" style="height: 16px;"></div>
              </td>
              <td class="py-4 px-3">
                <div class="skeleton-loader w-full" style="height: 16px;"></div>
              </td>
              <td class="py-4 px-3">
                <div class="skeleton-loader w-full" style="height: 16px;"></div>
              </td>
            </tr>

          </tbody>

          <tfoot class="border-none bg-gss-dark text-white">
            <tr>
              <th></th>
              <th class="text-center p-3">No.</th>
              <th class="p-3">Nama Modul</th>
              <th class="p-3">Status</th>
              <th class="p-3">Waktu Pembuatan</th>
            </tr>
          </tfoot>

        </table>

      </div>

    </section>

  </main>
</template>

<script>

  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  export default {
    name: 'admin-modul',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    data: function() {
      return {
        tableLoaded: false,
        skeletons: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    },
    methods: {
      nextPage: function() {
        let calc = parseInt(this.$refs.navPage.value) + 1; 
        this.$refs.navPage.value = calc;
      },
      previousPage: function() {
        let calc = parseInt(this.$refs.navPage.value) - 1;
        if (calc < 1) {
          return;
        }
        this.$refs.navPage.value = calc;
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

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

</style>