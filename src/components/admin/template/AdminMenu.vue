<template>

  <nav class="pb-6 pt-0 px-4 desktop:pt-6 menu">

    <ul v-if="menuLoaded">

      <li v-for="menu in menus" v-bind:key="menu.men_id">

        <div >
          <router-link v-if="linkOrNot(menu)" v-on:click="sidebarToggle" v-bind:to=" `/${adminPage}/${menu.men_link}` " v-bind:class="`menu-item ${menu.status}`">
            <font-awesome v-bind:icon="(menu.men_icon == null) ? 'fa-solid fa-chevron-right' : menu.men_icon" class="mr-3 icon"></font-awesome>
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
          
          <router-link v-on:click="sidebarToggle" v-bind:to=" `/${adminPage}/${child.men_link}` " v-for="child in menu.men_child" v-bind:key="child.men_id" v-bind:class="`submenu-item ${child.status}`">
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
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  export default {
    name: 'admin-template-menu',
    props: [
      'menus',
      'menuLoaded',
      'sidebarToggle'
    ],
    components: {
      'font-awesome': FontAwesomeIcon
    },
    data: function() {
      return {
        adminPage: process.env.VUE_APP_ADMIN_PAGE
      }
    },
    methods: {
      linkOrNot: function(menu) {
        return (menu.men_link != null && menu.men_link != 'null' && menu.men_link.length > 0) ? true : false;
      }
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