<template>
  <form v-on:submit="checkAndSend" class="login-form shadow-md bg-white rounded-0 w-full h-screen flex justify-center smartphone:rounded-md smartphone:h-auto smartphone:block">

    <div class="w-full">

      <header class="p-6 px-10 border border-x-0 border-t-0">
        <h1 class="h2 font-bold">Ubah Password</h1>
      </header>

      <section class="p-10 pb-6">

        <div class="form-group mb-6">
          <label for="password" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Password</label>

          <div class="input-group relative mb-3">
            <input id="password" v-bind:type="passwordInputType" class="block w-full border-b-2 p-2 pl-0 transition outline-0 focus:outline focus:outline-offset-1 focus:outline-gss" v-model="data.password">

            <button v-if="seePassword" v-on:click="seePassword = !seePassword" type="button" class="absolute top-2 right-2">
              <font-awesome icon="fa-regular fa-eye-slash" class="login-icon text-gray-400"></font-awesome>
            </button>

            <button v-else v-on:click="seePassword = !seePassword" type="button" class="absolute top-2 right-2">
              <font-awesome icon="fa-regular fa-eye" class="login-icon text-gray-400"></font-awesome>
            </button>

          </div>
        </div>

        <div class="form-group mb-10">
          <label for="passwordConf" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Konfirmasi Password</label>

          <div class="input-group relative mb-3">
            <input id="passwordConf" v-bind:type="passwordConfInputType" class="block w-full border-b-2 p-2 pl-0 transition outline-0 hover:border-gss focus:border-gss" v-model="data.passwordConf">

            <button v-if="seePasswordConf" v-on:click="seePasswordConf = !seePasswordConf" type="button" class="absolute top-2 right-2">
              <font-awesome icon="fa-regular fa-eye-slash" class="login-icon text-gray-400"></font-awesome>
            </button>

            <button v-else v-on:click="seePasswordConf = !seePasswordConf" type="button" class="absolute top-2 right-2">
              <font-awesome icon="fa-regular fa-eye" class="login-icon text-gray-400"></font-awesome>
            </button>

          </div>
        </div>

        <div class="flex">

          <router-link v-bind:to="{ name: 'login.index' }" class="block mr-2 w-full btn bg-gray-400 text-white hover:bg-gray-500">
            Batal
          </router-link>

          <button type="submit" class="block ml-2 w-full btn bg-gss text-white hover:bg-gss-dark">
            Simpan
          </button>

        </div>

      </section>

    </div>

  </form>
</template>

<script>

// load library
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { usePublicApi } from '../../helper/Api';
import Swal from 'sweetalert2';

export default {
  name: 'login-forgot-password',
  components: {
    'font-awesome': FontAwesomeIcon
  },
  inject: ['changePreloadStatus'],
  data: function() {
    return {
      seePassword: false,
      seePasswordConf: false,
      data: {
        token: '',
        password: '',
        passwordConf: ''
      }
    }
  },
  methods: {
    checkAndSend: function(e) {
      
      e.preventDefault();

      // preload
      this.changePreloadStatus();

      if (this.data.password !== this.data.passwordConf) {
        Swal.fire(
          'Peringatan!',
          'Kolom password dan konfirmasi password tidak sesuai',
          'warning'
        );
      }

      let app = this;

      let postData = new FormData();
      postData.append('token', app.data.token);
      postData.append('password', app.data.password);
      postData.append('konfirmasi', app.data.passwordConf);

      usePublicApi(`${process.env.VUE_APP_API_AUTH_SLUG}/ubah-password/post`, {
        app: app,
        method: 'post',
        data: postData,
        success: function(res) {

          Swal.fire({
            icon: res.data.status,
            title: res.data.title,
            text: res.data.message
          }).then(() => {
            app.$router.push({ name: 'login.index' });
          });

        },
        final: function() {
          app.changePreloadStatus();
        }
      });
    }
  },
  computed: {
    passwordInputType: function() {
      return (this.seePassword == true) ? 'text' : 'password';
    },
    passwordConfInputType: function() {
      return (this.seePasswordConf == true) ? 'text' : 'password';
    }
  },
  beforeCreate: function() {

    let app = this;
    let urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');

    // data
    let postData = new FormData();
    postData.append('token', token);

    usePublicApi('autentikasi/ubah-password/data', {
      app: app,
      method: 'post',
      data: postData,
      catch: function() {
        app.$router.push({ name: 'login.index' });
      }
    });
  },
  created: function() {
    let urlParams = new URLSearchParams(window.location.search);
    this.data.token = urlParams.get('token');
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>