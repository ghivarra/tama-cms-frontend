<template>

  <div v-on:click="checkDropdown" id="admin" class="admin block bg-slate-200 smartphone:flex">

    <!-- BACKDROP -->
    <div v-show="sidebarShown" v-on:click="sidebarToggle" class="fixed top-0 left-0 bg-neutral-900 opacity-50 z-20 h-screen w-screen desktop:hidden"></div>

    <!-- SIDEBAR -->
    <aside ref="sidebar" class="admin-sidebar -translate-x-full w-full z-30 h-screen bg-gss-dark shadow-md z-5 fixed top-0 left-0 transition-all smartphone:w-sidebar tablet:w-1/2 laptop:w-1/3 desktop:sticky desktop:w-sidebar desktop:translate-x-0">
      
      <header class="bg-white items-center flex justify-between py-4 pr-4 pl-8 desktop:block">

        <img v-if="logoLoaded" v-bind:src="logo" v-bind:alt="website.pgn_nama" class="logo w-full desktop:mx-auto">
        <div v-else class="logo skeleton-loader w-full mx-auto hidden desktop:block"></div>

        <!--<h1 class="font-bold block desktop:hidden">
          MENU
        </h1>-->

        <button v-on:click="sidebarToggle" type="button" class="block text-red-500 desktop:hidden">
          <font-awesome icon="fa-solid fa-xmark" class="h1"></font-awesome>
        </button>

      </header>>

      <!-- LOAD MENU -->
      <admin-template-menu v-bind:menus="menus" v-bind:menuLoaded="menuLoaded" v-bind:sidebarToggle="sidebarToggle"></admin-template-menu>

    </aside>

    <!-- INNER -->
    <div class="admin-inner w-full h-full desktop:w-inner">

      <!-- INNER HEADER -->
      <header class="w-full p-3 flex items-center justify-between px-8">

        <button v-on:click="sidebarToggle" type="button" class="btn p-2 px-4 block bg-white rounded-full shadow-sm desktop:hidden h3">
          <font-awesome icon="fa-solid fa-bars"></font-awesome>
        </button>

        <h1 class="h1 font-bold hidden desktop:block">{{ title }}</h1>

        <section class="dropdown relative inline-block">

          <div>
            <button v-on:click="showMainMenu = !showMainMenu" type="button" data-dropdown="true" class="flex p-2 tablet:px-4 bg-white rounded-full shadow-sm items-center">
              
              <figure class="m-0 p-0 tablet:mr-4">
                <img v-if="adminLoaded" v-bind:src="getProfilePicture(35)" class="rounded-full border" v-bind:alt="admin.adm_nama">
                <div v-else class="profil-foto skeleton-loader rounded-full"></div>
              </figure>

              <div class="mr-4 hidden tablet:block">

                <p v-if="adminLoaded" class="profil-nama text-left mb-0 text-sm truncate ...">{{ admin.adm_nama }}</p>
                <p v-else class="profil-nama skeleton-loader"></p>

                <p v-if="adminLoaded" class="profil-role text-left mb-0 text-sm truncate ... text-muted">{{ admin.rol_nama }}</p>
                <p v-else class="profil-role skeleton-loader"></p>

              </div>

              <div class="hidden tablet:block">
                <font-awesome v-if="showMainMenu" icon="fa-solid fa-chevron-up"></font-awesome>
                <font-awesome v-else icon="fa-solid fa-chevron-down"></font-awesome>
              </div>

            </button>
          </div>

          <Transition name="slide-fade-down"><!-- DROPDOWN -->

            <div v-if="showMainMenu" class="origin-top-right absolute right-0 mt-2 py-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
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

      <!-- ALTERNATIVE TITLE -->
      <h1 class="h1 font-bold block desktop:hidden px-8">{{ title }}</h1>

      <!-- COMPONENT -->
      <component v-bind:is="currentComponent" v-bind:key="$route.path"></component>

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
  import { computed, markRaw, defineAsyncComponent } from 'vue';

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
      'website',
      'websiteLoaded'
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

        // website data
        getIcon: this.getIcon,
        getLogo: this.getLogo,
      }
    },
    data: function() {
      return {
        logo: '',
        logoLoaded: false,
        title: this.$route.meta.title,

        // data
        admin: {},
        adminLoaded: false,

        // menu
        showMainMenu: false,
        sidebarShown: false,

        // sidebar menu
        menus: [],
        menuLoaded: false,

        // modals           
        modals: {
          showPengaturanAkun: false,
          showPengaturanPassword: false
        },

        // view
        currentComponent: markRaw(defineAsyncComponent(() => {
          return import(`./${this.$route.meta.view}.vue`);
        }))
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
        this.title = newRoutes.meta.title;

        this.currentComponent = markRaw(defineAsyncComponent(() => {
          return import(`./${newRoutes.meta.view}.vue`);
        }));
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
        this.logo = imageURL(`assets/informasi/logo-${data.pgn_slug}.png?v=${data.pgn_versi_web}.${data.pgn_versi_logo}&width=120&height=120`);
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
        createModal(this.modals.showPengaturanAkun);
        this.modals.showPengaturanAkun = !this.modals.showPengaturanAkun;
      },
      modalTogglePengaturanPassword: function() {
        createModal(this.modals.showPengaturanPassword);
        this.modals.showPengaturanPassword = !this.modals.showPengaturanPassword;
      },
      getLogo: function(size) {
        let data = this.website;
        return imageURL(`assets/informasi/logo-${data.pgn_slug}.png?v=${data.pgn_versi_web}.${data.pgn_versi_logo}&width=${size}`);
      },
      getIcon: function(size) {
        let data = this.website;
        return imageURL(`assets/informasi/icon-${data.pgn_slug}.png?v=${data.pgn_versi_web}.${data.pgn_versi_icon}&width=${size}`);
      },

      // VIEW ONLY
      sidebarToggle: function() {
        if (this.$refs.sidebar.classList.contains('-translate-x-full')) {
          this.$refs.sidebar.classList.remove('-translate-x-full');
          this.sidebarShown = true;
        } else {
          this.$refs.sidebar.classList.add('-translate-x-full');
          this.sidebarShown = false;
        }
      }
    },
    created: function() {
      // update
      if (this.websiteLoaded) {
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

  @import '../../../node_modules/@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';

  #table_length, #table_filter, #table_paginate {
    display: none !important;
  }

  table.dataTable thead th, table.dataTable thead td {
    border-bottom: none !important;
  }

  .admin {

    .main-component-wrapper {
      min-height: calc(100vh - 82px);
    }

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

  .dt-fixed-left {
      position: sticky;
      left: 0;
    }

</style>