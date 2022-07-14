<template>

  <form v-on:submit="login" class="login-form shadow-md bg-white px-10 pb-8 pt-10 rounded-0 w-full h-screen flex justify-center items-center smartphone:rounded-md smartphone:h-auto smartphone:block smartphone:pt-4 smartphone:pb-6">

    <section class="w-full">

      <img class="login-logo block mx-auto mb-6 smartphone:mb-4" v-bind:src="logo">

      <div class="form-group mb-8">
        <label for="username" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Username</label>
        <input id="username" type="text" class="block w-full border-b-2 p-2 pl-0 transition-all outline-0 hover:border-gss focus:border-gss" v-model="data.username">
      </div>

      <div class="form-group mb-10">
        <label for="password" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Password</label>

        <div class="input-group relative mb-3">
          <input id="password" v-bind:type="passwordInputType" class="block w-full border-b-2 p-2 pl-0 transition outline-0 hover:border-gss focus:border-gss" v-model="data.password">

          <button v-if="seePassword" v-on:click="seePassword = !seePassword" type="button" class="absolute top-2 right-2">
            <font-awesome icon="fa-regular fa-eye-slash" class="login-icon text-gray-400"></font-awesome>
          </button>

          <button v-else v-on:click="seePassword = !seePassword" type="button" class="absolute top-2 right-2">
            <font-awesome icon="fa-regular fa-eye" class="login-icon text-gray-400"></font-awesome>
          </button>

          

        </div>

      </div>

      <button type="submit" class="block w-full text-center py-2 bg-gss text-white rounded-md mb-8 transition hover:bg-gss-dark">
        <font-awesome icon="fa-solid fa-right-to-bracket" class="text-white mr-1"></font-awesome>
        Login
      </button>

      <small class="text-xs text-center text-gray-400 block">{{ appVer }}</small>

    </section>

  </form>

</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// load functions
import { imageURL } from '../../helper/Global';
import { auth } from '../../helper/Api';
import { swalError } from '../../helper/Error';

// load library
import Swal from 'sweetalert2';

export default {
  name: 'login-form',
  components: {
    'font-awesome': FontAwesomeIcon
  },
  data: function() {
    return {
      logo: imageURL('assets/informasi/logo.png?v=1.0&width=150&height=150'),
      appVer: `${process.env.VUE_APP_NAME} v${process.env.VUE_APP_VERSION}`,
      seePassword: false,
      data: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login: function(e) {

      e.preventDefault();
      this.preloadStatus = true;

      let formData = new FormData();
      formData.append('username', this.data.username);
      formData.append('password', this.data.password);

      let app = this;

      auth('autentikasi', {
        app: app,
        data: formData,
        success: function(response) {

          let data = response.data;
          Swal.fire({
            title: data.title,
            text: data.message,
            icon: data.status,
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCloseButton: false,
            showCancelButton: false,
          }).then(() => {
            app.$router.go({name: 'admin.index'});
          });

        },
        catch: function(error) {
          // error tapi muncul response dari server
          let data = error.response.data;

          // load swalError
          swalError({
            title: data.title,
            icon: data.status,
            message: data.message,
            confirmButtonText: 'OK'
          });
        },
        final: function() {
          app.preloadStatus = !app.preloadStatus;
        }
      });
    }
  },
  computed: {
    passwordInputType: function() {
       return (this.seePassword == true) ? 'text' : 'password';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>