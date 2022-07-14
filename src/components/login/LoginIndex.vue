<template>

  <Transition>
    <global-preloader v-bind:preloadStatus="preloadStatus"></global-preloader>
  </Transition>

  <main class="login h-screen w-full flex justify-center items-center">
    <component v-bind:is="currentComponent" v-bind:logo="logo"></component>
  </main>

</template>

<script>

// load components
import GlobalPreloader from '../GlobalPreloader.vue';

// load library
import { defineAsyncComponent, markRaw } from 'vue';
import { imageURL } from '../../helper/Global';

// export
export default {
  name: 'login-index',
  components: {
    'global-preloader': GlobalPreloader
  },
  data: function() {
    return {
      preloadStatus: true,
      logo: imageURL('assets/informasi/logo.png?v=1.0&width=150&height=150'),
      bgLogin: `url('${require('../../assets/image/login-background.svg')}')`,
      currentComponent: markRaw(defineAsyncComponent(() => {
        return import(`./${this.$router.currentRoute.value.meta.view}.vue`);
      }))
    }
  },
  mounted: function() {
    let app = this;

    setTimeout(() => {
      app.preloadStatus = !app.preloadStatus;
    }, 250);
    
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
    max-width: 500px;
  }

  &-icon {
    width: 24px;
  }
}

</style>