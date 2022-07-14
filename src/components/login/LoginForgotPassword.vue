<template>
  <form v-on:submit="sendEmail" class="login-form shadow-md bg-white rounded-0 w-full h-screen flex justify-center smartphone:rounded-md smartphone:h-auto smartphone:block">

    <div class="w-full">

      <header class="p-6 px-10 border border-x-0 border-t-0">
        <h1 class="h2 font-bold">Konfirmasi Email</h1>
      </header>

      <section class="p-10 pb-6">

        <div class="form-group mb-10">
          <label for="email" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Email Terdaftar</label>
          <input id="email" type="email" class="block w-full border-b-2 p-2 pl-0 transition-all outline-0 hover:border-gss focus:border-gss" v-model="email" placeholder="akun@email.com">
        </div>

        <div class="flex">

          <router-link v-bind:to="{ name: 'login.index' }" class="block mr-2 w-full text-center px-4 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500 transition-colors">
            Kembali
          </router-link>

          <button type="submit" class="block ml-2 w-full text-center px-4 py-2 rounded-md bg-gss text-white hover:bg-gss-dark transition-colors">
            Cari
          </button>

        </div>

      </section>

    </div>

  </form>
</template>

<script>

import { usePublicApi } from '../../helper/Api';
import Swal from 'sweetalert2';

export default {
  name: 'login-forgot-password',
  props: {
    logo: {
      type: String,
      required: true
    },
    changePreloadStatus: {
      type: Function,
      required: true
    }
  },
  data: function() {
    return {
      email: ''
    }
  },
  methods: {
    sendEmail: function(e) {
      e.preventDefault();

      // preload on
      this.changePreloadStatus();

      let app = this;
      let postData = new FormData();
      postData.append('email', app.email);

      usePublicApi('autentikasi/lupa-password/post', {
        app: app,
        method: 'post',
        data: postData,
        success: function(res) {
          Swal.fire({
            icon: res.data.status,
            title: res.data.title,
            text: res.data.message
          });
        },
        catch: function(error) {
          Swal.fire({
            icon: error.response.data.status,
            title: error.response.data.title,
            text: error.response.data.message
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

</style>