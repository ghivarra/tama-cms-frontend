<template>

  <Transition>
    <global-preloader v-bind:preloadStatus="preloadStatus"></global-preloader>
  </Transition>

  <div id="appBody" class="text-dark">
      <router-view v-bind:key="$route.fullPath"></router-view>
  </div>

</template>

<script>

  // load components
  import GlobalPreloader from './components/GlobalPreloader.vue';

  // load library
  import { computed } from 'vue';
  import { usePublicApi } from './helper/Api';

  export default {
    name: 'App',
    components: {
      'global-preloader': GlobalPreloader
    },
    data: function() {
      return {
        websiteInfo: {},
        preloadStatus: true
      }
    },
    methods: {
      changePreloadStatus: function() {
        return this.preloadStatus = !this.preloadStatus;
      }
    },
    provide: function() {
      return {
        website: computed(() => {
          return this.websiteInfo;
        }),
        preloadStatus: computed(() => {
          return this.preloadStatus
        }),
        changePreloadStatus: this.changePreloadStatus,
      }
    },
    created: function() {
      let app = this;

      usePublicApi('website', {
        app: app,
        method: 'get',
        success: function(res) {
          app.websiteInfo = res.data.data;
        }
      });
    }
  }

</script>

<style lang="scss">

  /* import font  */
  @import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

  html, body { font-size: 16px; font-family: 'Rubik', sans-serif; }

  .h {

    &1 {
      font-size: 1.75rem;
    }

    &2 {
      font-size: 1.5rem;
    }

    &3 {
      font-size: 1.25rem;
    }

    &4 {
      font-size: 1.1rem;
    }
  }

  .v-enter-active, .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from, .v-leave-to {
    opacity: 0;
  }

  .slide-fade-right-enter {

    &-active {
      transition: all 0.3s ease-out;
    }

    &-from {
      transform: translateX(20px);
      opacity: 0;
    }
  }

  .slide-fade-right-leave {

    &-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    &-to {
      transform: translateX(20px);
      opacity: 0;
    }
  }

  .slide-fade-down-enter {

    &-active {
      transition: all 0.3s ease-out;
    }

    &-from {
      transform: translateY(20px);
      opacity: 0;
    }
  }

  .slide-fade-down-leave {

    &-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    &-to {
      transform: translateY(20px);
      opacity: 0;
    }
  }

  .slide-fade-up-enter {

    &-active {
      transition: all 0.3s ease-out;
    }

    &-from {
      transform: translateY(-20px);
      opacity: 0;
    }
  }

  .slide-fade-up-leave {

    &-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    &-to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }

  .skeleton-loader {
    position: relative;
    overflow: hidden;
    background-color: #d1d5db;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(#fff, 0) 0,
        rgba(#fff, 0.2) 20%,
        rgba(#fff, 0.5) 60%,
        rgba(#fff, 0)
      );
      animation: shimmer 1.5s infinite;
      content: '';
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
  }

</style>