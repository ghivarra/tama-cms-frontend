<template>

  <nav class="p-6 px-4 menu">

    <ul v-if="menuLoaded">

      <li v-for="menu in menus" v-bind:key="menu.men_id">

        <div >
          <router-link v-if="menu.men_link != null" v-bind:to=" `/${adminPage}/${menu.men_link}` " v-bind:class="`menu-item ${menu.status}`">
            <font-awesome v-bind:icon="menu.men_icon" class="mr-3 icon"></font-awesome>
            <span>{{ menu.men_nama }}</span>
          </router-link>

          <button v-else type="button" v-on:click="menu.childStatus = !menu.childStatus" v-bind:data-toggle="menu.childStatus" v-bind:class="`menu-item ${menu.status}`">
            <font-awesome v-bind:icon="menu.men_icon" class="mr-3 icon"></font-awesome>
            <span>{{ menu.men_nama }}</span>

            <font-awesome v-if="menu.childStatus" icon="fa-solid fa-chevron-down" class="icon absolute right-2 bottom-3"></font-awesome>
            <font-awesome v-else icon="fa-solid fa-chevron-left" class="icon absolute right-2 bottom-3"></font-awesome>
          </button>
        </div>

        <div v-show="menu.childStatus">
          
          <router-link v-bind:to=" `/${adminPage}/${child.men_link}` " v-for="child in menu.men_child" v-bind:key="child.men_id" v-on:click="child.status = !child.status" v-bind:class="`submenu-item ${child.status}`">
            <font-awesome icon="fa-regular fa-circle" class="icon mr-3"></font-awesome>
            {{ child.men_nama }}
          </router-link>

        </div>

      </li>

    </ul>

    <ul v-else>
      <li class="menu skeleton-loader mb-4 w-full rounded-md"></li>
      <li class="menu skeleton-loader mb-4 w-full rounded-md"></li>
      <li class="menu skeleton-loader mb-4 w-full rounded-md"></li>
      <li class="menu skeleton-loader mb-4 w-full rounded-md"></li>
    </ul>

  </nav>

</template>

<script>

  // load functions
  import { usePrivateApi } from '../../../helper/Api';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  // load library
  import Swal from 'sweetalert2';

  export default {
    name: 'admin-template-menu',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    data: function() {
      return {
        adminPage: process.env.VUE_APP_ADMIN_PAGE,
        menus: [],
        menuLoaded: false
      }
    },
    created: function() {
      let app = this;

      usePrivateApi('sertifikasi/menu-list', {
        app: app,
        method: 'get',
        success: function(res) {
          let data = res.data.data;
          let path = app.$router.currentRoute.value.path;

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
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .menu {

    &.skeleton-loader {
      height: 40px;
    }

    .icon {
      width: 27px;
    }
  }

</style>