<template>
  <main role="main" class="p-8">
    
    <section v-for="skeleton in skeletons" v-bind:key="skeleton" class="p-6 mb-8 last:mb-8 rounded-md bg-white shadow-sm">

      <div class="flex mb-4">
        <div class="head skeleton-loader rounded-full mr-4 last:mr-4"></div>  
        <div class="head-name skeleton-loader rounded-sm"></div>
      </div>

      <div class="flex mb-8">
        <div v-for="button in buttons" v-bind:key="button" class="button skeleton-loader rounded-sm mr-4"></div>
      </div>

      <div>
        
        <div v-for="line in lines" v-bind:key="line" class="mb-4 last:mb-0 flex">
          <div class="h-6 w-6 mr-4 skeleton-loader"></div>
          <div class="h-6 w-6 mr-4 skeleton-loader"></div>
          <div class="h-6 line mr-4 skeleton-loader"></div>
          <div class="h-6 line mr-4 skeleton-loader"></div>
          <div class="h-6 line mr-4 skeleton-loader"></div>
        </div>

      </div>

    </section>

  </main>
</template>

<script>

  import { range } from '../../helper/Global';

  export default {
    name: 'admin-loader',
    data: function() {
      return {
        lines: range(4),
        buttons: range(3),
        skeletons: range(2)
      }
    }
  }

</script>

<style lang="scss" scoped>

  .skeleton-loader {

    &.head {
      width: 40px;
      height: 40px;

      &-name {
        height: 40px;
        width: calc(50% - 40px);
      }
    }

    &.button {
      width: 85px;
      height: 35px;
    }

    &.line {
      width: 100%;
      max-width: 250px;
    }
  }

</style>