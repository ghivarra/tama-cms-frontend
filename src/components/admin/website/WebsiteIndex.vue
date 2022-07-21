<template>
  <main role="main" class="px-8 py-10">

    <form v-on:submit.prevent="formSubmit" class="admin-content bg-white rounded-sm pt-6 shadow-sm">
      
      <div class="form-group mb-6 px-6">
        <label for="nama" class="font-bold block">Nama</label>
        <input v-model="data.nama" id="nama" type="text" class="form-modern" required>
      </div>

      <div class="form-group mb-6 px-6">
        <label for="tagline" class="font-bold block">Tagline</label>
        <input v-model="data.tagline" id="tagline" type="text" class="form-modern" required>
      </div>

      <div class="form-group mb-6 px-6">
        <label for="deskripsi" class="font-bold block mb-3">Deskripsi</label>
        <textarea v-model="data.deskripsi" id="deskripsi" type="text" class="form-control py-3 focus:border-gss" rows="3" required></textarea>
      </div> 

      <div class="form-group mb-6 px-6">
        <label for="logo" class="font-bold block mb-3">Logo</label>
        <img ref="logoPrev" v-show="websiteLoaded" v-bind:src="getLogo(150)" v-bind:alt="data.nama" class="p-3 border rounded-sm block mb-3 preview">

        <button v-on:click="$refs.uploadLogoInput.click()" type="button" class="btn bg-gss hover:bg-gss-dark text-white">Upload Logo</button>
        <input v-on:change="previewUploaded($event, $refs.logoPrev, 'logo')" ref="uploadLogoInput" type="file" class="hidden" accept="image/png">
      </div>

      <div class="form-group mb-6 px-6">
        <label for="logo" class="font-bold block mb-3">Icon</label>
        <img ref="iconPrev" v-show="websiteLoaded" v-bind:src="getIcon(150)" v-bind:alt="data.nama" class="p-3 border rounded-sm block mb-3 preview">

        <button v-on:click="$refs.uploadIconInput.click()" type="button" class="btn bg-gss hover:bg-gss-dark text-white">Upload Icon</button>
        <input v-on:change="previewUploaded($event, $refs.iconPrev, 'icon')" ref="uploadIconInput" type="file" class="hidden" accept="image/png">
      </div>

      <div class="p-4 border-t text-right">
        <button type="submit" class="btn bg-success hover:bg-success-dark text-center text-white">Simpan Perubahan</button>
      </div>

    </form>

  </main>
</template>

<script>

  // load functions
  import { usePrivateApi } from '../../../helper/Api';

  // load library
  import Swal from 'sweetalert2';

  export default {
    name: 'website-index',
    inject: ['website', 'websiteLoaded', 'updateWebsiteData', 'getLogo', 'getIcon'],
    watch: {
      website: function(web) {
        this.updateRawData(web);
      }
    },
    data: function() {
      return {
        data: {
          nama: '',
          tagline: '',
          deskripsi: '',
          icon: null,
          logo: null
        }
      }
    },
    methods: {
      updateRawData: function(web) {
        this.data.nama = web.pgn_nama;
        this.data.tagline = web.pgn_tagline;
        this.data.deskripsi = web.pgn_deskripsi;
        this.data.nama = web.pgn_nama;
      },
      previewUploaded: function(e, ref, jenis) {
        let file = e.target.files[0];
        let url = URL.createObjectURL(file);

        // preview and set uploaded
        ref.setAttribute('src', url);
        this.data[jenis] = file;
      },
      formSubmit: function() {
        let app = this;
        let postData = new FormData();

        // append data
        postData.append('nama', app.data.nama);
        postData.append('tagline', app.data.tagline);
        postData.append('deskripsi', app.data.deskripsi);
        postData.append('logo', app.data.logo);
        postData.append('icon', app.data.icon);

        usePrivateApi('sertifikasi/website/update', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire(data.title, data.message, data.status).then(() => {
              app.updateWebsiteData();
            });
          }
        });
      }
    },
    created: function() {
      // update
      if (this.websiteLoaded) {
        this.updateRawData(this.website);
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .preview {
    max-width: 150px;
  }

</style>