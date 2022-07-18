<template>

  <div v-on:click="checkDropdown" class="admin block bg-slate-200 smartphone:flex">

    <!-- SIDEBAR -->
    <aside class="admin-sidebar w-sidebar h-screen bg-gss-dark shadow-md z-5 relative">
      
      <header class="bg-white p-4">
        <img v-if="logoLoaded" v-bind:src="logo" v-bind:alt="website.pgn_nama" class="logo w-full mx-auto">
        <div v-else class="logo skeleton-loader w-full mx-auto"></div>
      </header>

      <!-- LOAD MENU -->
      <admin-template-menu v-bind:menus="menus" v-bind:menuLoaded="menuLoaded"></admin-template-menu>

    </aside>

    <!-- INNER -->
    <div class="admin-inner w-inner h-full">

      <!-- INNER HEADER -->
      <header class="w-full p-3 flex items-center justify-between px-8">
        <h1 class="h1 font-bold">{{ title }}</h1>
        <section class="dropdown relative inline-block">

          <div>
            <button v-on:click="showMainMenu = !showMainMenu" type="button" data-dropdown="true" class="flex py-2 px-4 bg-white rounded-full shadow-sm items-center">
              
              <figure class="m-0 p-0 mr-4">
                <img v-if="adminLoaded" v-bind:src="getProfilePicture(35)" class="rounded-full border" v-bind:alt="admin.adm_nama">
                <div v-else class="profil-foto skeleton-loader rounded-full"></div>
              </figure>

              <div class="mr-4">

                <p v-if="adminLoaded" class="profil-nama text-left mb-0 text-sm truncate ...">{{ admin.adm_nama }}</p>
                <p v-else class="profil-nama skeleton-loader"></p>

                <p v-if="adminLoaded" class="profil-role text-left mb-0 text-sm truncate ... text-muted">{{ admin.rol_nama }}</p>
                <p v-else class="profil-role skeleton-loader"></p>

              </div>

              <font-awesome v-if="showMainMenu" icon="fa-solid fa-chevron-up"></font-awesome>
              <font-awesome v-else icon="fa-solid fa-chevron-down"></font-awesome>

            </button>
          </div>

          <Transition name="slide-fade-down"><!-- DROPDOWN -->

            <div v-if="showMainMenu" class="origin-top-right absolute right-0 mt-2 py-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
              <div class="py-1" role="none">

                <button v-on:click="modalTogglePengaturanAkun" type="button" class="dropdown-item" role="menuitem" tabindex="-1" id="menu-item-0">
                  <font-awesome icon="fa-solid fa-user-gear" class="mr-1"></font-awesome>
                  Pengaturan Akun
                </button>
                <button v-on:click="modalTogglePengaturanPassword" type="button" class="dropdown-item" role="menuitem" tabindex="-1" id="menu-item-1">
                  <font-awesome icon="fa-solid fa-key" class="mr-1"></font-awesome>
                  Ubah Password
                </button>

                <hr class="my-2">

                <button v-on:click="logout" type="button" class="dropdown-item">
                  <font-awesome icon="fa-solid fa-right-from-bracket" class="mr-1"></font-awesome>
                  Keluar
                </button>

              </div>
            </div>

          </Transition>

        </section>
      </header>

      <div class="px-8 py-4">
        KONTEN nu long pisan KONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisanKONTEN nu long pisan
      </div>
    </div>

    <!-- MODALS -->
    <modal-pengaturan-akun v-bind:show="modals.showPengaturanAkun" v-bind:toggle="modalTogglePengaturanAkun"></modal-pengaturan-akun>
    <modal-pengaturan-password v-bind:show="modals.showPengaturanPassword" v-bind:toggle="modalTogglePengaturanPassword"></modal-pengaturan-password>
  </div>
</template>

<script>

  // load functions
  import { setCookie, imageURL, createModal } from '../../helper/Global';
  import { usePrivateApi } from '../../helper/Api';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { computed } from 'vue';

  // load library
  import Swal from 'sweetalert2';

  // load components
  import AdminTemplateMenu from './template/AdminMenu.vue';
  import ModalPengaturanAkun from './modal/ModalPengaturanAkun.vue';
  import ModalPengaturanPassword from './modal/ModalPengaturanPassword.vue';

  export default {
    name: 'admin-index',
    components: {
      'font-awesome': FontAwesomeIcon,
      'admin-template-menu': AdminTemplateMenu,
      'modal-pengaturan-akun': ModalPengaturanAkun,
      'modal-pengaturan-password': ModalPengaturanPassword
    },
    inject: [
      'changePreloadStatus',
      'preloadStatus',
      'website'
    ],
    provide: function() {
      return {
        admin: computed(() => {
          return this.admin;
        }),
        adminLoaded: computed(() => {
          return this.adminLoaded;
        }),
        updateDataAdmin: this.updateDataAdmin,
        getProfilePicture: this.getProfilePicture,
      }
    },
    data: function() {
      return {
        logo: '',
        logoLoaded: false,
        title: this.$router.currentRoute.value.meta.title,

        // data
        admin: {},
        adminLoaded: false,

        // menu
        showMainMenu: false,

        // sidebar menu
        menus: [],
        menuLoaded: false,

        // modals           
        modals: {
          showPengaturanAkun: false,
          showPengaturanPassword: false
        }
      }
    },
    watch: {
      website: function(data) {
        this.updateMeta(data);
        this.updateLogo(data);
      },
      $route: function(newRoutes) {
        this.updateMeta(this.website);
        this.updateDataAdmin();
        this.updateMenuData(this.menus, newRoutes.path, this);

//        this.currentComponent = markRaw(defineAsyncComponent(() => {
//          return import(`./${newRoutes.meta.view}.vue`);
//        }));
      }
    },
    methods: {
      updateDataAdmin: function() {
        let app = this;
        usePrivateApi('sertifikasi/admin-info', {
          app: app,
          method: 'get',
          success: function(res) {
            let data = res.data.data;
            app.admin = data;
            app.adminLoaded = true;
          },
          final: function() {
            if (app.preloadStatus) {
              app.changePreloadStatus();
            }
          }
        });
      },
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
      updateMenuData: function(data, path, app) {
        Array.prototype.forEach.call(data, function(item, i){

          data[i]['status'] = (path == `/${process.env.VUE_APP_ADMIN_PAGE}/${item.men_link}`) ? 'active' : 'inactive';
          data[i]['childStatus'] = false;

          if (item.men_child.length > 0) {

            Array.prototype.forEach.call(item.men_child, function(val, n){

              if (path == `/${process.env.VUE_APP_ADMIN_PAGE}/${val.men_link}`) {
                data[i].men_child[n]['status'] = 'active';
                data[i]['childStatus'] = true;
                data[i]['status'] =  'active';
              } else {
                data[i].men_child[n]['status'] = 'inactive';
              }

            });
          }

        });

        app.menus = data;
        app.menuLoaded = true;

        // return
        return data;
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

            app.changePreloadStatus();

            usePrivateApi('sertifikasi/logout', {
              app: app,
              method: 'get',
              success: function() {
                setCookie(process.env.VUE_APP_AUTH_KEY, process.env.VUE_APP_AUTH_SIGN, 0);
                app.$router.push({ name: 'login.index' });    
              },
              catch: function() {
                app.changePreloadStatus();
              }
            });
          }
        });
      },
      checkDropdown: function(e) {

        let path = e.composedPath();

        if (path.length > 0)
        {
          let broke;

          for (var i = 0; i < path.length; i++) {
            if (path[i].hasAttribute('data-dropdown')) {
              broke = true;
              break;
            } else if (path[i] == document.querySelector('html')) {
              break;
            }
          }

          if (broke) {
            return broke;
          }
        }

        if (e.target.hasAttribute('data-dropdown'))
        {
          return false;
        } else if (this.showMainMenu) {
          this.showMainMenu = false;
        }
      },
      getProfilePicture: function(size) {

        size = (size == undefined) ? '80' : size.toString();

        if (this.admin.length < 1 || this.admin.adm_foto == null) {
          return imageURL(`assets/photo/admin/placeholder.jpg?v=1.0&width=${size}&height=${size}`);
        }

        return imageURL(`assets/photo/admin/${this.admin.adm_foto}?v=1.0&width=${size}&height=${size}`);
      },
      modalTogglePengaturanAkun: function() {
        createModal(this, 'showPengaturanAkun');
        this.modals.showPengaturanAkun = !this.modals.showPengaturanAkun;
      },
      modalTogglePengaturanPassword: function() {
        createModal(this, 'showPengaturanPassword');
        this.modals.showPengaturanPassword = !this.modals.showPengaturanPassword;
      },
    },
    created: function() {
      // update
      if (this.website.pgn_slug != undefined) {
        this.updateLogo(this.website);
        this.updateMeta(this.website);
      }

      let app = this;

      usePrivateApi('sertifikasi/menu-list', {
        app: app,
        method: 'get',
        success: function(res) {
          app.updateMenuData(res.data.data, app.$route.path, app);
        },
        catch: function(error) {
          if (error.response.data != undefined) {

            let data = error.response.data;
            Swal.fire({
              icon: data.status,
              title: data.title,
              html: data.message
            });

          } else {

            Swal.fire({
              icon: 'error',
              title: 'Gagal Menarik Data Menu',
              text: 'Server sedang sibuk silahkan coba lagi'
            }).then(() => {
              if (process.env.NODE_ENV != 'development') {
                console.clear();
              }
            });

          }
        },
      });

      // admin info
      this.updateDataAdmin();
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  @import '../../../node_modules/datatables.net-dt/css/jquery.dataTables.min.css';

  .admin {

    &-sidebar {

      .logo {
        max-width: 120px;

        &.skeleton-loader {
          height: 24px;
        }
      }
    }

    &-inner {
      min-height: 100vh;

      .profil {

        &-foto {
          object-fit: cover;
          object-position: center;

          &.skeleton-loader {
            width: 35px;
            height: 35px;
          }
        }

        &-nama {
          width: 120px;
          
          &.skeleton-loader {
            margin-bottom: 7px;
            height: 14px;
          }
        }

        &-role {

          &.skeleton-loader {
            width: 75px;
            height: 14px;
          }
        }
      }

    }
  }

  .modal-open {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

</style>