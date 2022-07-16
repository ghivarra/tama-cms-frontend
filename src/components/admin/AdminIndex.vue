<template>

  <div v-on:click="checkMainMenu" class="admin block smartphone:flex">

    <!-- SIDEBAR -->
    <aside class="admin-sidebar w-sidebar h-screen bg-gss shadow-md z-5 relative">
      
      <header class="bg-white p-4 pt-3">
        <img v-if="logoLoaded" v-bind:src="logo" v-bind:alt="website.pgn_nama" class="logo w-full mx-auto">
        <div v-else class="logo skeleton-loader w-full mx-auto"></div>
      </header>

    </aside>

    <!-- INNER -->
    <div class="admin-inner w-inner h-full bg-slate-100">

      <!-- INNER HEADER -->
      <header class="w-full p-3 flex items-center justify-between px-8">
        <h1 class="h2 font-bold">{{ title }}</h1>
        <section class="dropdown relative inline-block">

          <div>
            <button v-on:click="showMainMenu = !showMainMenu" type="button" data-dropdown="true" class="block py-2 px-4 bg-white rounded-full shadow-sm">FOTO DAN MENU</button>
          </div>

          <Transition name="slide-fade-right">

            <div v-if="showMainMenu" class="origin-top-right absolute right-0 mt-2 py-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
              <div class="py-1" role="none">
                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm transition-colors hover:bg-gss-light hover:text-white" role="menuitem" tabindex="-1" id="menu-item-0">Account settings</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm transition-colors hover:bg-gss-light hover:text-white" role="menuitem" tabindex="-1" id="menu-item-1">Support</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm transition-colors hover:bg-gss-light hover:text-white" role="menuitem" tabindex="-1" id="menu-item-2">License</a>
              </div>
            </div>

          </Transition>

        </section>
      </header>

      <div class="p-10">
        <button v-on:click="logout" type="button" class="text-center py-2 px-4 bg-error text-white rounded-md mb-8 transition hover:bg-error-dark">
          <font-awesome icon="fa-solid fa-right-to-bracket mr-2"></font-awesome>
          Logout Ahhh
        </button>
      </div>
    </div>

  </div>
</template>

<script>

  // load library
  import { setCookie, imageURL } from '../../helper/Global';
  import { usePrivateApi } from '../../helper/Api';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { computed } from 'vue';
  import Swal from 'sweetalert2';

  export default {
    name: 'admin-index',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    inject: [
      'changePreloadStatus',
      'preloadStatus',
      'website'
    ],
    data: function() {
      return {
        logo: '',
        logoLoaded: false,
        title: this.$router.currentRoute.value.meta.title,

        // data
        admin: {},
        showMainMenu: false
      }
    },
    watch: {
      website: function(data) {
        this.updateMeta(data);
        this.updateLogo(data);
      }
    },
    provide: function() {
      return {
        admin: computed(() => {
          return this.admin;
        })
      }
    },
    methods: {
      updateLogo: function(data) {
        this.logo = imageURL(`assets/informasi/logo-${data.pgn_slug}.png?v=${data.pgn_versi_web}.${data.pgn_versi_icon}&width=120&height=120`)
        this.logoLoaded = true;
      },
      updateMeta: function(data) {
        if (data.pgn_nama == undefined) {
          return false;
        }

        let head = document.head;
        head.querySelector('title').innerText = `${this.$router.currentRoute.value.meta.title} - ${data.pgn_nama} | ${data.pgn_tagline}`;
        head.querySelector('link[rel=icon]').setAttribute('href', imageURL(`assets/informasi/icon-${data.pgn_slug}.png?v=${data.pgn_versi_web}.${data.pgn_versi_icon}&width=32&height=32`));

        // create meta description
        let meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        meta.setAttribute('content', data.pgn_deskripsi);
        head.appendChild(meta);
      },
      logout: function() {

        let app = this;

        Swal.fire({
          title: 'Peringatan',
          icon: 'warning',
          text: 'Apakah anda yakin akan keluar dari aplikasi?',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Ya, Keluar Sekarang',
          cancelButtonText: 'Batal'
        }).then((result) => {
          if (result.isConfirmed) {
            usePrivateApi('sertifikasi/logout', {
              app: app,
              method: 'get',
              success: function() {
                setCookie(process.env.VUE_APP_AUTH_KEY, process.env.VUE_APP_AUTH_SIGN, 0);
                app.$router.push({ name: 'login.index' });    
              }
            });
          }
        });
      },
      checkMainMenu: function(e) {
        if (e.target.hasAttribute('data-dropdown'))
        {
          return false;
        } else if (this.showMainMenu) {
          this.showMainMenu = false;
        }
      },
      getProfilePic: function(size) {

        size = (size == undefined) ? '80' : size.toString();

        if (this.admin.length < 1 || this.admin.adm_foto == null) {
          return imageURL(`assets/photo/admin/placeholder.jpg?v=1.0&width=${size}&height=${size}`);
        }

        return imageURL(`assets/photo/admin/${this.admin.adm_foto.length}?v=1.0&width=${size}&height=${size}`);
      }
    },
    created: function() {
      let app = this;

      // update
      if (this.website.pgn_slug != undefined) {
        this.updateLogo(this.website);
        this.updateMeta(this.website);
      }

      // admin info
      usePrivateApi('sertifikasi/admin-info', {
        app: app,
        method: 'get',
        success: function(res) {
          let data = res.data.data;
          app.admin = data;
        },
        final: function() {
          if (app.preloadStatus) {
            app.changePreloadStatus();
          }
        }
      });

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .admin {

    &-sidebar {

      .logo {
        max-width: 72px;

        &.skeleton-loader {
          height: 24px;
        }
      }
    }

    &-inner {
      min-height: 100vh;
    }
  }

</style>