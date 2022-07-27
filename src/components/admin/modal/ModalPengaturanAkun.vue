<template>
  <Transition name="slide-fade-up">
    <form ref="modal" v-if="show" v-on:submit="updateProfile" v-on:click="checkToggle" class="modal pengaturan">
      <!-- MODAL CONTENT -->
      <div ref="modalDialog" class="modal-dialog">
        <div class="modal-content">
          <header class="modal-content-header flex justify-between items-center">
            <h2 class="h3 font-bold">Akun</h2>
            <button v-on:click="toggle" type="button" class="text-red-500 hover:text-red-600 transition-colors">
              <font-awesome icon="fa-solid fa-xmark" class="h3"></font-awesome>
            </button>
          </header>

          <div class="modal-content-body">
            
            <div class="block tablet:flex">

              <figure class="p-0 mb-6 tablet:mb-0">
                <img v-if="adminLoaded" v-bind:src="getProfilePicture(138)" ref="uploadFotoPreview" class="block foto mb-6 h-auto rounded-full border mx-auto">
                <div v-else class="block foto mb-6 skeleton-loader rounded-full mx-auto tablet:mx-0"></div>

                <div class="w-full">
                  <input v-on:change="previewProfilePicture" ref="uploadFotoInput" id="uploadFoto" type="file" class="cursor-pointer hidden" accept="image/jpg,image/png,image/gif">
                  <button v-on:click="$refs.uploadFotoInput.click()" type="button" class="btn block bg-gss hover:bg-gss-dark text-white mx-auto">
                    <font-awesome icon="fa-solid fa-image" class="mr-1"></font-awesome>
                    Ubah Foto Profil
                  </button>
                </div>
              </figure>
              
              <div class="grow p-0 tablet:pl-6">
                
                <div class="form-group w-full mb-4">
                  <label class="font-bold block mb-1">Role</label>
                  <p v-if="adminLoaded">{{ admin.rol_nama }}</p>
                  <div v-else class="input skeleton-loader w-full"></div>
                </div>

                <div class="form-group mb-4 w-full">
                  <label class="font-bold block mb-1">Email</label>
                  <p v-if="adminLoaded">{{ admin.adm_email }}</p>
                  <div v-else class="input skeleton-loader w-full"></div>
                </div>

                <div class="form-group w-full">
                  <label for="nama" class="font-bold block mb-1">Nama Akun</label>
                  <input v-if="adminLoaded" v-model="data.nama" id="nama" type="text" class="form-control" required>
                  <div v-else class="input skeleton-loader w-full"></div>
                </div>

              </div>

            </div>

          </div>

          <footer class="modal-content-footer flex justify-end">
            <button v-on:click="toggle" type="button" class="btn text-white bg-gray-500 hover:bg-gray-600 w-full mr-2 tablet:w-auto">Batal</button>
            <button type="submit" class="btn text-white bg-success hover:bg-success-dark w-full ml-2 tablet:w-auto">Simpan</button>
          </footer>

        </div><!-- /modal-content -->
      </div><!-- /modal-dialog -->
    </form>
  </Transition>
</template>

<script>

  // load functions
  import { usePrivateApi } from '../../../helper/Api';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  // load library
  import Swal from 'sweetalert2';

  export default {
    name: 'modal-pengaturan-akun',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    props: [
      'show', 
      'toggle'
    ],
    inject: [
      'admin',
      'adminLoaded',
      'updateDataAdmin',
      'getProfilePicture',
    ],
    data: function() {
      return {
        data: {
          nama: this.admin.nama,
          foto: undefined
        }
      }
    },
    watch: {
      admin: function(admin) {
        this.data.nama = admin.adm_nama;
      }
    },
    methods: {
      checkToggle: function(e) {
        if (e.target == this.$refs.modal || e.target == this.$refs.modalDialog) {
          this.toggle();
        }
      },
      previewProfilePicture: function(e) {
        let file = e.target.files[0];
        let url = URL.createObjectURL(file);

        // preview and set pp
        this.$refs.uploadFotoPreview.setAttribute('src', url);
        this.data.foto = file;
      },
      updateProfile: function(e) {
        e.preventDefault();

        if ((this.data.foto == undefined) && (this.data.nama == this.admin.adm_nama)) {
          Swal.fire({
            icon: 'warning',
            title: 'Peringatan',
            text: 'Anda tidak melakukan perubahan apapun pada akun anda'
          });

          return false;
        }
        
        let app = this;
        let postData = new FormData();

        postData.append('nama', this.data.nama);
        if (this.data.foto != undefined) {
          postData.append('foto', this.data.foto);
        }

        usePrivateApi('akun/update', {
          app: app,
          method: 'post',
          data: postData,
          success: function() {
            Swal.fire({
              icon: 'success',
              title: 'Perubahan Akun Berhasil',
              text: 'Anda berhasil merubah data akun anda'
            }).then(() => {
              app.updateDataAdmin();
            });
          }
        });
      }
    },
    created: function() {
      if (this.adminLoaded) {
        this.data.nama = this.admin.adm_nama;
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .pengaturan {

    .foto {
      height: 138px;
      width: 138px;
      object-fit: cover;
      object-position: center;
    }

    .input {

      &.skeleton-loader {
        height: 16px;
      }
    }
  }

</style>