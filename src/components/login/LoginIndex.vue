<template>

  <main class="login h-screen w-full flex justify-center items-center">
    <KeepAlive>
      <component 
        v-bind:is="currentComponent" 
        v-bind:logo="logo"
        v-bind:logoLoaded="logoLoaded" 
        v-bind:website="website"></component>
    </KeepAlive>
  </main>

</template>

<script>

  // load library
  import { defineAsyncComponent, markRaw } from 'vue';
  import { imageURL } from '../../helper/Global';
  import { usePublicApi } from '../../helper/Api';

  // export
  export default {
    name: 'login-index',
    inject: ['website', 'preloadStatus', 'changePreloadStatus'],
    data: function() {
      return {
        logo: '',
        logoLoaded: false,
        bgLogin: `url('${require('../../assets/image/login-background.svg')}')`,
        currentComponent: markRaw(defineAsyncComponent(() => {
          return import(`./${this.$router.currentRoute.value.meta.view}.vue`);
        })),
      }
    },
    watch: {
      website: function(data) {
        this.updateMeta(data);
        this.updateLogo(data);
      }
    },
    methods: {
      updateLogo: function(data) {
        this.logo = imageURL(`assets/informasi/icon-${data.pgn_slug}.png?v=${data.pgn_versi_web}.${data.pgn_versi_icon}&width=120&height=120`)
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
      }
    },
    created: function() {
      let app = this;
      usePublicApi('autentikasi/cek-akses', {
        app: app,
        method: 'get',
        success: function() {
          if (app.preloadStatus) {
            app.changePreloadStatus();
          }
        }
      });
    },
    mounted: function() {
      if (this.website.pgn_nama != undefined) {
        this.updateMeta(this.website);
        this.updateLogo(this.website);
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .login {
    background-image: v-bind(bgLogin);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: right;

    &-form {
      max-width: 450px;
    }

    &-icon {
      width: 24px;
    }

    &-logo {
      height: auto;
      max-width: 120px;

      &.skeleton-loader {
        min-height: 120px;
      }
    }
  }

</style>