<template>
  <form class="login-form shadow-md bg-white rounded-0 w-full h-screen flex justify-center smartphone:rounded-md smartphone:h-auto smartphone:block">

    <div class="w-full">

      <header class="p-4 px-10 border border-x-0 border-t-0">
        <h1 class="h2 font-bold">Lupa Password</h1>
      </header>

      <section class="p-10 pb-6">

        <div class="form-group mb-10">
          <label for="email" class="block cursor-pointer text-gray-500 tracking-wide text-sm font-bold">Email</label>
          <input id="email" type="email" class="block w-full border-b-2 p-2 pl-0 transition-all outline-0 hover:border-gss focus:border-gss" v-model="data.email">
        </div>

        <div class="flex">

          <router-link v-bind:to="{ name: 'login.index' }" class="block mr-2 w-full text-center px-4 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500 transition-colors">
            Kembali
          </router-link>

          <button type="button" class="block ml-2 w-full text-center px-4 py-2 rounded-md bg-gss text-white hover:bg-gss-dark transition-colors">
            Cari
          </button>

        </div>

      </section>

    </div>

  </form>
</template>

<script>

export default {
  name: 'login-forgot-password',
  props: {
    logo: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      data: {
        email: ''
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>