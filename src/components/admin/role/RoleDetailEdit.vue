<template>
  
  <form v-on:submit.prevent="submitData">
    
    <section v-if="formLoaded" class="modal-content-body">
      
      <div class="form-group mb-6">
        <label for="nama" class="font-bold">Nama Role</label>
        <input v-model="form.rol_nama" id="nama" type="text" class="form-modern" required>
      </div>

      <div class="form-group mb-6">
        <div class="font-bold mb-2 block">Modul Aktif</div>
        <select ref="modules" id="allModules" v-model="form.rol_modul" class="tom-selected" multiple></select>
      </div>

      <div class="form-group mb-6">
        <div class="font-bold mb-2 block">Menu Aktif</div>
        <select ref="menus" id="allMenus" v-model="form.rol_menu" class="tom-selected" multiple></select>
      </div>

      <div class="form-group mb-6">
        <div class="font-bold block mb-2">Status</div>
        <select v-model="form.rol_status" id="status" class="form-select" required>
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
  import { range } from '../../../helper/Global';

  // load library
  import Swal from 'sweetalert2';
  import TomSelect from 'tom-select';

  export default {
    name: 'role-detail-edit',
    props: ['toggle', 'role'],
    inject: ['changePreloadStatus', 'reloadTable', 'allMenu', 'allModul'],
    data: function() {
      return {
        adminPage: `${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_ADMIN_PAGE}/`,
        formLoaded: false,
        form: {},

        // skelly boys
        skeletons: range(4),

        tomSelected: false,
        tomSelect: {
          modul: null,
          menu: null
        }
      }
    },
    methods: {
      submitData: function() {
        let app = this;

        app.changePreloadStatus();

        let postData = new FormData();
        postData.append('rol_id', app.role.rol_id);
        postData.append('rol_nama', app.form.rol_nama);
        postData.append('rol_status', app.form.rol_status);
        postData.append('rol_modul', JSON.stringify(app.form.rol_modul));
        postData.append('rol_menu', JSON.stringify(app.form.rol_menu));


        usePrivateApi('menu/update-parent', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire(data.title, data.message, data.status).then(() => {
              app.toggle();
              app.reloadTable();
            });
          },
          final: function() {
            app.changePreloadStatus();
          }
        });
      },
      useTomSelect: function() {

        let mod = document.getElementById('allModules');
        let men = document.getElementById('allMenus');
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

          this.tomSelect.modul = new TomSelect('#allModules',{
            plugins: {
              remove_button:{
                title:'Hapus Modul',
              }
            },
            options: modulesOption,
            valueField: 'value',
            labelField: 'text',
            searchField: 'text',
            items: app.form.rol_modul,
            persist: false,
            create: false,
            maxOptions: null,
            onDelete: function() {
              return true;
            }
          });

          this.tomSelect.menu = new TomSelect('#allMenus',{
            plugins: {
              remove_button:{
                title:'Hapus Menu',
              }
            },
            options: menusOption,
            valueField: 'value',
            labelField: 'text',
            searchField: 'text',
            items: app.form.rol_menu,
            persist: false,
            create: false,
            maxOptions: null,
            onDelete: function() {
              return true;
            }
          });

          console.log(this.tomSelect.menu);
          console.log(this.tomSelect.modul);

          this.tomSelected = true;
        }
      },
    },
    created: function() {

      let app = this;

      usePrivateApi(`role/select/${this.role.rol_id}`, {
        app: app,
        method: 'get',
        success: function(res) {
          let data = res.data.data;

          data.rol_modul = JSON.parse(data.rol_modul);
          data.rol_menu = JSON.parse(data.rol_menu);

          app.form = data;
          app.formLoaded = true;
        }
      });
    },
    mounted: function() {
      if (this.formLoaded) {
        this.useTomSelect();
      }
    },
    updated: function() {
      if (this.formLoaded) {
        this.useTomSelect();
      }
    },
    beforeUnmount: function() {
      this.tomSelect.modul.destroy();
      this.tomSelect.menu.destroy();
      this.tomSelect.modul = null;
      this.tomSelect.menu = null;
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
      margin: 0 8px 8px 0;
    }
  }

</style>