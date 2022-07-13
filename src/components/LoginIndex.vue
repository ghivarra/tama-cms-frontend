<template>

  <Transition>
    <global-preloader v-bind:preloadStatus="preloadStatus"></global-preloader>
  </Transition>

  <main class="login h-screen w-full flex justify-center items-center">

    <form v-on:submit="login" class="login-form shadow-md bg-white p-10 rounded-0 w-full h-screen flex justify-center items-center smartphone:rounded-md smartphone:h-auto smartphone:block">

      <section>

        <img class="login-logo block w-full mx-auto mb-10" v-bind:src="logo">

        <div class="form-group mb-8">
          <label for="username" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Username</label>
          <input id="username" type="text" class="block w-full border-b-2 p-2 pl-0 transition-all outline-0 hover:border-gss focus:border-gss" v-model="data.username">
        </div>

        <div class="form-group mb-10">
          <label for="password" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Password</label>

          <div class="input-group relative">
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
    
  </main>

</template>

<script>

// load components
import GlobalPreloader from './GlobalPreloader.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// load functions
import { imageURL } from '../helper/Global';
import { auth } from '../helper/Api';
import { swalError } from '../helper/Error';

// load library
import Swal from 'sweetalert2';

// export
export default {
  name: 'login-index',
  components: {
    'global-preloader': GlobalPreloader,
    'font-awesome': FontAwesomeIcon
  },
  data: function() {
    return {
      preloadStatus: true,
      bgLogin: `url('${require('../assets/image/login-background.svg')}')`,
      logo: imageURL('assets/kanal/logo/logo_gssnews_min.png?v=1.1.0'),
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
  },
  created: function() {

    let app = this;

    setTimeout(function() {
      app.preloadStatus = !app.preloadStatus;
    }, 250);

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.login {
  background-image: v-bind(bgLogin);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;

  &-form {
    max-width: 400px;
  }

  &-logo {
    max-width: 250px;
  }

  &-icon {
    width: 24px;
  }
}

</style>