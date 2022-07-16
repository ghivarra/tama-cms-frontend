<template>

  <nav class="p-6 px-4">

    <ul v-if="menuLoaded">
      <li class="menu-item">Hello</li>
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

  export default {
    name: 'admin-template-menu',
    data: function() {
      return {
        menuLoaded: false
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .menu {

    &.skeleton-loader {
      height: 40px;
    }
  }

</style>