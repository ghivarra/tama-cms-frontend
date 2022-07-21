<template>
  <main role="main" class="px-8 py-6 pt-10">

    <!-- COTNROL BUTTON -->
    <section class="flex items-center mb-6">
      <button v-on:click="openCreateForm" type="button" class="btn shadow-sm text-white bg-gss hover:bg-gss-dark focus:bg-gss-dark mr-3">
        Tambah Menu
      </button>
      <button v-on:click="simpanUrutan" type="button" class="save-menu btn shadow-sm text-white bg-success hover:bg-success-dark focus:bg-success-dark">
        Simpan
      </button>
    </section>
		
    <!-- LIST MENU -->
    <section v-if="menuLoaded" id="listMenu" class="list-menu">

      <vue-draggable v-model="urutan" item-key="men_id" ghost-class="ghost">

        <template v-slot:item="{ element, index }">

          <div class="list-menu-item mb-6">
            <button v-on:click="element.open = !element.open" type="button" class="text-left block p-4 px-6 bg-white shadow-sm rounded-sm form-select cursor-pointer transition-colors hover:bg-gss-light hover:text-white focus:bg-gss-light focus:text-white">
              <span>{{ element.men_nama }}</span>
            </button>
            <div v-show="element.open" class="p-4 bg-white border border-t-0 no-drag">
              <div  class="flex items-center mb-6 no-drag">
                <button v-bind:data-id="element.men_id" type="button" class="open-add-submenu btn text-white bg-gss hover:bg-gss-dark mr-3">Tambah Submenu</button>
                <button v-bind:data-id="element.men_id" type="button" class="open-detail btn text-white bg-primary hover:bg-primary-dark">Detail</button>
              </div>

              <vue-draggable v-model="urutan[index].childs" item-key="men_id" ghost-class="ghost">
                
                <template v-slot:item="{ element }">

                  <div class="list-menu-item mb-6">
                    <button v-on:click="element.open = !element.open" type="button" class="text-left block p-4 px-6 bg-white shadow-sm rounded-sm form-select cursor-pointer transition-colors hover:bg-gss-light hover:text-white focus:bg-gss-light focus:text-white">
                      <span>{{ element.men_nama }}</span>
                    </button>
                    <div v-show="element.open" class="p-4 bg-white border border-t-0 no-drag">
                      <div  class="flex items-center mb-6 no-drag">
                        <button v-bind:data-id="element.men_id" type="button" class="open-detail btn text-white bg-primary hover:bg-primary-dark">Detail</button>
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
  

</template>

<script>

	// load functions
	import { usePrivateApi } from '../../../helper/Api';

  // load libraries
  import VueDraggable from 'vuedraggable';
  import Swal from 'sweetalert2';

  export default {
    name: 'menu-index',
    components: {
      'vue-draggable': VueDraggable
    },
    inject: ['changePreloadStatus', 'updateMenuData'],
    data: function() {
      return {
        menuLoaded: false,
        menus: {},

        // draggable
        urutan: [],
        drag: false,

        // skelly bois
        skeletons: [1, 2, 3, 4, 5]
      }
    },
    methods: {
      getAllMenu: function() {
        let app = this;
        usePrivateApi('menu/get', {
          app: app,
          method: 'get',
          success: function(res) {
            app.menus = res.data.data;

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
        usePrivateApi('menu/urutan-update', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire(data.title, data.message, data.status).then(() => {
              app.updateMenu();
            });
          }
        });
      }
    },
    created: function() {
      // update menu
      this.getAllMenu();
    },
    mounted: function() {
      // update sortable menu
      
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>