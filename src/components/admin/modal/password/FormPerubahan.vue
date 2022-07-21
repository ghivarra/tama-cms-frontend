<template>
  <form v-on:submit="checkPassword" class="pb-10 tablet:pt-10">

    <div class="form-group mb-4">
      <label for="passwordLama" class="block font-bold mb-2">Password Lama</label>
      <div class="input-group relative">
        <input v-model="password.old" ref="passwordLama" type="password" id="passwordLama" class="form-control focus:border-gss" required>

        <div v-if="showPassword.old" v-on:click="seePassword('passwordLama', 'old')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye-slash" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

        <div v-else v-on:click="seePassword('passwordLama', 'old')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

      </div>
    </div>

    <div class="form-group mb-4">
      <label for="passwordBaru" class="block font-bold mb-2">Password Baru</label>
      <div class="input-group relative">
        <input v-model="password.new" ref="passwordBaru" type="password" id="passwordBaru" class="form-control focus:border-gss" required>

        <div v-if="showPassword.new" v-on:click="seePassword('passwordBaru', 'new')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye-slash" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

        <div v-else v-on:click="seePassword('passwordBaru', 'new')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

      </div>
    </div>

    <div class="form-group mb-8">
      <label for="passwordConf" class="block font-bold mb-2">Konfirmasi Password Baru</label>
      <div class="input-group relative">
        <input v-model="password.conf" ref="passwordConf" type="password" id="passwordConf" class="form-control focus:border-gss" required>

        <div v-if="showPassword.conf" v-on:click="seePassword('passwordConf', 'conf')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye-slash" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

        <div v-else v-on:click="seePassword('passwordConf', 'conf')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

      </div>
    </div>

    <div class="text-center">
      <button type="submit" class="btn bg-success hover:bg-success-dark text-white">Simpan</button>
    </div>

  </form>
</template>

<script>

  // Load Functions
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { usePrivateApi } from '../../../../helper/Api';

  // Load library
  import Swal from 'sweetalert2';

  export default {
    name: 'form-perubahan',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    inject: [
      'changePreloadStatus'
    ],
    props: [
      'nextStep'
    ],
    data: function() {
      return {
        password: {
          old: '',
          new: '',
          conf: ''
        },
        showPassword: {
          old: false,
          new: false,
          conf: false
        }
      }
    },
    methods: {
      seePassword: function(el, key) {
        let item = this.$refs[el];
        let inputType = (item.getAttribute('type') == 'text') ? 'password' : 'text';

        this.showPassword[key] = (item.getAttribute('type') == 'text') ? false : true;
        item.setAttribute('type', inputType);
      },
      checkPassword: function(e) {
        e.preventDefault();

        // use private api
        let app = this;
        app.changePreloadStatus();

        if (app.password.new !== app.password.conf) {
          Swal.fire('Peringatan', 'Password Baru harus sesuai dengan Konfirmasi Password', 'warning');
          return false;
        } else if (app.password.old === app.password.new) {
          Swal.fire('Peringatan', 'Password baru tidak boleh sama dengan password lama', 'warning'); 
          return false;
        }

        // compile post data
        let postData = new FormData();
        postData.append('password_lama', app.password.old);
        postData.append('password_baru', app.password.new);
        postData.append('password_konf', app.password.conf);

        usePrivateApi('akun/rubah-password', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire({
              icon: data.status,
              title: data.title,
              text: data.message
            }).then(() => {
              app.nextStep();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .seepass-btn {
    width: 25px;
  }

</style>