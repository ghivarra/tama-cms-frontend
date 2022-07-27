<template>
  <main role="main" class="px-8 py-6 pt-10">

    <!-- COTNROL BUTTON -->
    <section class="flex items-center mb-6">
      <button v-on:click.prevent="createParentMenuToggle" type="button" class="btn shadow-sm text-white bg-gss hover:bg-gss-dark focus:bg-gss-dark mr-3">
        Tambah Menu
      </button>
      <button v-on:click.prevent="simpanUrutan" type="button" class="save-menu btn shadow-sm text-white bg-success hover:bg-success-dark focus:bg-success-dark">
        Simpan
      </button>
    </section>
		
    <!-- LIST MENU -->
    <section v-if="menuLoaded" id="listMenu" class="list-menu">

      <vue-draggable v-model="urutan" item-key="men_id" ghost-class="ghost">

        <template v-slot:item="{ element, index }">

          <div class="list-menu-item mb-6">
            <button v-on:click.prevent="element.open = !element.open" type="button" class="text-left block p-4 px-6 bg-white shadow-sm rounded-sm form-select cursor-pointer transition-colors hover:bg-gss-light hover:text-white focus:bg-gss-light focus:text-white">
              <span>{{ element.men_nama }}</span>
            </button>
            <div v-show="element.open" class="p-4 bg-white border border-t-0 no-drag">
              <div  class="flex items-center mb-6 no-drag">
                <button v-on:click.prevent="createSubMenuToggle" v-bind:data-id="element.men_id" v-bind:data-nama="element.men_nama" type="button" class="open-add-submenu btn text-white bg-gss hover:bg-gss-dark mr-3">Tambah Submenu</button>
                <button v-on:click.prevent="detailParentMenuToggle" v-bind:data-parent="index" type="button" class="open-detail btn text-white bg-primary hover:bg-primary-dark">Detail</button>
              </div>

              <vue-draggable v-model="urutan[index].childs" item-key="men_id" ghost-class="ghost">
                
                <template v-slot:item="{ element }">

                  <div class="list-menu-item mb-6">
                    <button v-on:click="element.open = !element.open" type="button" class="text-left block p-4 px-6 bg-white shadow-sm rounded-sm form-select cursor-pointer transition-colors hover:bg-gss-light hover:text-white focus:bg-gss-light focus:text-white">
                      <span>{{ element.men_nama }}</span>
                    </button>
                    <div v-show="element.open" class="p-4 bg-white border border-t-0 no-drag">
                      <div class="flex items-center mb-6 no-drag">
                        <button v-on:click.prevent="detailSubMenuToggle" v-bind:data-child="element.men_id" type="button" class="open-detail btn text-white bg-primary hover:bg-primary-dark">Detail</button>
                      </div>
                    </div>
                  </div>

                </template>

              </vue-draggable>
              
            </div>
          </div>

        </template>

      </vue-draggable>
      
    </section>

    <section v-else>
      
      <div v-for="skeleton in skeletons" v-bind:key="skeleton" class="h-10 w-full rounded-sm skeleton-loader mb-6 shadow-sm border"></div>

    </section>

  </main>

  <!-- MODALS-->
  <menu-create v-bind:show="createParentStatus" v-bind:toggle="createParentMenuToggle"></menu-create>
  <menu-detail v-bind:show="detailParentStatus" v-bind:toggle="detailParentMenuToggle" v-bind:menu="parentDetail"></menu-detail>

  <submenu-create v-bind:show="createSubStatus" v-bind:toggle="createSubMenuToggle" v-bind:parent="subMenuParent" v-bind:key="subMenuParent.id"></submenu-create>
  <submenu-detail v-bind:show="detailSubStatus" v-bind:toggle="detailSubMenuToggle" v-bind:key="subMenuParent.id" v-bind:menu="submenuDetail"></submenu-detail>

</template>

<script>

  // load components
  import MenuCreate from './MenuCreate.vue';
  import MenuDetail from './MenuDetail.vue';
  import SubMenuCreate from './SubMenuCreate.vue';
  import SubMenuDetail from './SubMenuDetail.vue';

	// load functions
	import { usePrivateApi } from '../../../helper/Api';
  import { createModal } from '../../../helper/Global';
  import { computed } from 'vue';

  // load libraries
  import VueDraggable from 'vuedraggable';
  import Swal from 'sweetalert2';

  export default {
    name: 'menu-index',
    components: {
      'vue-draggable': VueDraggable,
      'menu-create': MenuCreate,
      'menu-detail': MenuDetail,
      'submenu-create': SubMenuCreate,
      'submenu-detail': SubMenuDetail
    },
    inject: ['changePreloadStatus', 'updateMenuData'],
    provide: function() {
      return {
        menus: computed(() => {
          return this.menus;
        }),
        update: this.updateMenu,
        updateList: this.getAllMenu
      }
    },
    data: function() {
      return {
        menuLoaded: false,
        menus: {},

        // draggable
        urutan: [],
        drag: false,

        // skelly bois
        skeletons: [1, 2, 3, 4, 5],

        // modals
        createParentStatus: false,
        detailParentStatus: false,
        createSubStatus: false,
        detailSubStatus: false,

        // modals data
        subMenuParent: {
          id: 0,
          nama: ''
        },

        // detail
        parentDetail: [],
        submenuDetail: []
      }
    },
    methods: {
      getAllMenu: function() {
        let app = this;
        usePrivateApi('menu/get', {
          app: app,
          method: 'get',
          success: function(res) {
            app.menus  = res.data.data;
            app.urutan = [];

            Array.prototype.forEach.call(app.menus, (item) => {

              let submenu = [];

              if (item.men_child.length > 0) {
                Array.prototype.forEach.call(item.men_child, (child) => {
                  submenu.push({
                    men_id: child.men_id,
                    men_nama: child.men_nama,
                    open: false
                  });
                });
              }

              // push to urutan
              app.urutan.push({
                men_id: item.men_id,
                men_nama: item.men_nama,
                open: false,
                childs: submenu
              });

            });

            // app loaded
            app.menuLoaded = true;
          }
        });
      },
      updateMenu: function() {
        let app = this;
        usePrivateApi('menu-list', {
          app: app,
          method: 'get',
          success: function(response) {
            app.updateMenuData(response.data.data, app.$route.path);
          }
        });
      },
      simpanUrutan: function() {
        
        let input = [];

        Array.prototype.forEach.call(this.urutan, (item, n) => {

          input.push({
            men_id: item.men_id,
            men_urutan: (n + 1)
          });

          if (item.childs.length > 0) {
            Array.prototype.forEach.call(item.childs, (child, i) => {
              input.push({
                men_id: child.men_id,
                men_urutan: (i + 1)
              });
            });
          }
        });

        // axios bro
        let app = this;
        let postData = new FormData();
        postData.append('urutan', JSON.stringify(input));

        // send
        usePrivateApi('menu/update-urutan', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            app.updateMenu();
            Swal.fire(data.title, data.message, data.status);
          }
        });
      },

      // modal
      createParentMenuToggle: function() {
        createModal(this.createParentStatus);
        this.createParentStatus = !this.createParentStatus;
      },
      createSubMenuToggle: function(e) {
        createModal(this.createSubStatus);

        // set data
        if (!this.createSubStatus) {
          this.subMenuParent.id = e.target.getAttribute('data-id');
          this.subMenuParent.nama = e.target.getAttribute('data-nama');
        }

        // open modal
        this.createSubStatus = !this.createSubStatus;
      },
      detailParentMenuToggle: function(e) {
        createModal(this.detailParentStatus);

        // set data
        if (!this.detailParentStatus) {
          let key = e.target.getAttribute('data-parent');
          this.parentDetail = this.menus[key];
        }

        this.detailParentStatus = !this.detailParentStatus;
      },
      detailSubMenuToggle: function(e) {
        createModal(this.detailSubStatus);

        // set data
        if (!this.detailSubStatus) {
          let id = e.target.getAttribute('data-child');

          Array.prototype.forEach.call(this.menus, (item) => {

            if (item.men_child.length > 0) {
              Array.prototype.forEach.call(item.men_child, (child) => {
                if (child.men_id == id) {
                  this.submenuDetail = child;
                  this.subMenuParent.id = item.men_id;
                  this.subMenuParent.nama = item.men_nama;
                }
              });
            }

          });
        }

        this.detailSubStatus = !this.detailSubStatus;
      }
    },
    created: function() {
      // update menu
      this.getAllMenu();
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>