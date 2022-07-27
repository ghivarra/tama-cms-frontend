<template>
  
  <form v-on:submit.prevent="submitData">
    
    <section v-if="formLoaded" class="modal-content-body">
      
      <div class="form-group mb-6">
        <label for="nama" class="font-bold">Nama</label>
        <input v-model="form.adm_nama" id="nama" type="text" class="form-modern" required>
      </div>

      <div class="form-group mb-6">
        <label for="email" class="font-bold">Email</label>
        <input v-model="form.adm_email" id="email" type="email" class="form-modern" required>
      </div>

      <div class="form-group mb-6">
        <label for="role" class="font-bold block mb-2">Role</label>
        <select v-model="form.adm_role" id="role" class="form-select" required>
          <option value="">Pilih Role</option>
          <option v-for="role in allRoles" v-bind:key="role.rol_id" v-bind:value="role.rol_id">{{ role.rol_nama }}</option>
        </select>
      </div>

      <div class="form-group mb-6">
        <label for="password" class="font-bold">Password</label>
        <div class="relative">
          <input v-model="form.adm_password" v-bind:type="(passwordHidden) ? 'password' : 'text'" id="password" class="form-modern">
          <font-awesome v-on:click.prevent="passwordHidden = false" v-if="passwordHidden" icon="fa-regular fa-eye" class="text-muted absolute bottom-3 seepass right-3 cursor-pointer"></font-awesome>
          <font-awesome v-on:click.prevent="passwordHidden = true" v-else icon="fa-regular fa-eye-slash" class="text-muted absolute bottom-3 right-3 seepass cursor-pointer"></font-awesome>
        </div>
      </div>

      <div class="form-group mb-6">
        <label for="konf_password" class="font-bold">Konfirmasi Password</label>
        <div class="relative">
          <input v-model="konfirmasi" v-bind:type="(konfirmasiHidden) ? 'password' : 'text'" id="konf_password" class="form-modern">
          <font-awesome v-on:click.prevent="konfirmasiHidden = false" v-if="konfirmasiHidden" icon="fa-regular fa-eye" class="text-muted absolute bottom-3 seepass right-3 cursor-pointer"></font-awesome>
          <font-awesome v-on:click.prevent="konfirmasiHidden = true" v-else icon="fa-regular fa-eye-slash" class="text-muted absolute bottom-3 right-3 seepass cursor-pointer"></font-awesome>
        </div>
      </div>

      <div class="form-group mb-6">
        <label for="status" class="font-bold block mb-2">Status</label>
        <select v-model="form.adm_status" id="status" class="form-select" required>
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
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  // load library
  import Swal from 'sweetalert2';

  export default {
    name: 'akun-detail-edit',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    props: ['toggle', 'admin', 'updateMenu'],
    inject: ['changePreloadStatus', 'reloadTable', 'allRoles', 'updateDataAdmin'],
    data: function() {
      return {
        adminPage: `${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_ADMIN_PAGE}/`,
        formLoaded: false,
        form: {},

        // skelly boys
        skeletons: [1, 2, 3, 4],

        // password data
        konfirmasi: '',
        passwordHidden: true,
        konfirmasiHidden: true
      }
    },
    methods: {
      submitData: function() {

        if (this.form.adm_password !== this.konfirmasi) {
          Swal.fire('Peringatan', 'Kolom password dengan konfirmasi password tidak sesuai', 'warning');
          return false;
        }

        let app = this;

        app.changePreloadStatus();

        let postData = new FormData();
        postData.append('adm_id', app.admin.adm_id);
        postData.append('adm_nama', app.form.adm_nama);
        postData.append('adm_email', app.form.adm_email);
        postData.append('adm_password', app.form.adm_password);
        postData.append('adm_role', app.form.adm_role);
        postData.append('adm_status', app.form.adm_status);

        usePrivateApi('admin/update', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            app.updateDataAdmin();
            app.updateMenu();
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
    },
    created: function() {

      let app = this;

      usePrivateApi(`admin/select/${this.admin.adm_id}`, {
        app: app,
        method: 'get',
        success: function(res) {
          app.form = res.data.data;
          app.form.adm_password = '';
          app.formLoaded = true;
        }
      });
    }
  }

</script>