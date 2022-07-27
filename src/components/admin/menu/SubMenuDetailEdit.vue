<template>
  
  <form v-on:submit.prevent="submitData">
    
    <section v-if="formLoaded" class="modal-content-body">

      <div class="form-group mb-6">
        <label for="parent" class="font-bold">Parent</label>
        <select v-model="form.men_parent" id="parent" class="form-select">
          <option v-for="item in menus" v-bind:key="item.men_id" v-bind:value="item.men_id">{{ item.men_nama }}</option>
        </select>
      </div>
      
      <div class="form-group mb-6">
        <label for="nama" class="font-bold">Nama Menu</label>
        <input v-model="form.men_nama" id="nama" type="text" class="form-modern" required>
      </div>

      <div class="form-group mb-6">
        <label for="url" class="font-bold">Link/URL</label>
        <p class="text-muted mb-0">{{ `${adminPage}...` }}</p>
        <input v-model="form.men_link" id="url" type="text" class="form-modern">
      </div>

      <div class="form-group mb-6">
        <label for="status" class="font-bold block mb-2">Status</label>
        <select v-model="form.men_status" id="status" class="form-select" required>
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
    name: 'menu-detail-edit',
    props: ['toggle', 'menu'],
    inject: ['changePreloadStatus', 'update', 'updateList', 'menus'],
    data: function() {
      return {
        adminPage: `${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_ADMIN_PAGE}/`,
        formLoaded: false,
        form: {},

        // skelly boys
        skeletons: [1, 2, 3, 4]
      }
    },
    methods: {
      submitData: function() {
        let app = this;

        app.changePreloadStatus();

        let postData = new FormData();
        postData.append('men_id', app.form.men_id);
        postData.append('men_parent', app.form.men_parent);
        postData.append('men_nama', app.form.men_nama);
        postData.append('men_link', app.form.men_link);
        postData.append('men_status', app.form.men_status);

        usePrivateApi('menu/update-child', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            app.update();
            app.updateList();
            Swal.fire(data.title, data.message, data.status).then(() => {
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

      usePrivateApi(`menu/select/${this.menu.men_id}`, {
        app: app,
        method: 'get',
        success: function(res) {
          app.form = res.data.data;
          app.formLoaded = true;
        }
      });
    }
  }

</script>