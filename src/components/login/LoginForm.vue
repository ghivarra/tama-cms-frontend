<template>

  <form v-on:submit="login" class="login-form shadow-md bg-white p-8 px-10 rounded-0 w-full h-screen flex justify-center items-center smartphone:rounded-md smartphone:h-auto smartphone:block">

    <section class="w-full">

      <img v-if="logoLoaded" class="login-logo block mx-auto mb-8" v-bind:src="logo">
      <div v-else class="login-logo block mx-auto mb-6 smartphone:mb-4 skeleton-loader"></div>

      <div class="form-group mb-8">
        <label for="email" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Email</label>
        <input v-model="data.email" id="email" type="email" class="block w-full border-b-2 p-2 pl-0 transition-all outline-0 hover:border-gss focus:border-gss"  required>
      </div>

      <div class="form-group mb-10">
        <label for="password" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Password</label>

        <div class="input-group relative mb-3">
          <input v-model="data.password" id="password" v-bind:type="passwordInputType" class="block w-full border-b-2 p-2 pl-0 transition outline-0 hover:border-gss focus:border-gss"  required>

          <button v-if="seePassword" v-on:click="seePassword = !seePassword" type="button" class="absolute top-2 right-2">
            <font-awesome icon="fa-regular fa-eye-slash" class="login-icon text-gray-400"></font-awesome>
          </button>

          <button v-else v-on:click="seePassword = !seePassword" type="button" class="absolute top-2 right-2">
            <font-awesome icon="fa-regular fa-eye" class="login-icon text-gray-400"></font-awesome>
          </button>

        </div>

        <router-link v-bind:to="{ name: 'login.forgot.password' }" class="text-gss">Lupa Password?</router-link>

      </div>

      <button type="submit" class="block w-full btn text-white mb-8 bg-gss hover:bg-gss-dark">
        <font-awesome icon="fa-solid fa-right-to-bracket" class="text-white mr-1"></font-awesome>
        Login
      </button>

      <small class="text-xs text-center text-gray-400 block">{{ appVer }}</small>

    </section>

  </form>

</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// load functions
import { auth } from '../../helper/Api';

// load library
import Swal from 'sweetalert2';

export default {
  name: 'login-form',
  props: {
    website: {
      type: Object,
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    logoLoaded: {
      type: Boolean,
      required: true
    }
  },
  inject: ['changePreloadStatus'],
  components: {
    'font-awesome': FontAwesomeIcon
  },
  data: function() {
    return {
      
      appVer: `${process.env.VUE_APP_NAME} v${process.env.VUE_APP_VERSION}`,
      seePassword: false,
      data: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login: function(e) {

      e.preventDefault();
      this.changePreloadStatus();

      let formData = new FormData();
      formData.append('email', this.data.email);
      formData.append('password', this.data.password);

      let app = this;

      auth({
        app: app,
        data: formData,
        success: function(response) {

          let data = response.data;
          Swal.fire({
            title: data.title,
            text: data.message,
            icon: data.status,
            timer: 1500,
            timerProgressBar: true,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCloseButton: false,
            showCancelButton: false,
          }).then(() => {
            app.$router.go({name: 'admin.index'});
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>