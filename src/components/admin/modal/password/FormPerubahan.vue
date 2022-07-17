<template>
  <form v-on:submit="checkPassword" class="pt-6">

    <div class="form-group mb-4">
      <label for="passwordLama" class="block font-bold mb-2">Password Lama</label>
      <div class="input-group relative">
        <input ref="passwordLama" type="password" id="passwordLama" class="form-control focus:border-gss" required>

        <div v-if="showPassword.old" v-on:click="seePassword('passwordLama', 'old')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye-slash" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

        <div v-else v-on:click="seePassword('passwordLama', 'old')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

      </div>
    </div>

    <div class="form-group mb-4">
      <label for="passwordBaru" class="block font-bold mb-2">Password Baru</label>
      <div class="input-group relative">
        <input ref="passwordBaru" type="password" id="passwordBaru" class="form-control focus:border-gss" required>

        <div v-if="showPassword.new" v-on:click="seePassword('passwordBaru', 'new')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye-slash" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

        <div v-else v-on:click="seePassword('passwordBaru', 'new')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

      </div>
    </div>

    <div class="form-group mb-8">
      <label for="passwordConf" class="block font-bold mb-2">Konfirmasi Password Baru</label>
      <div class="input-group relative">
        <input ref="passwordConf" type="password" id="passwordConf" class="form-control focus:border-gss" required>

        <div v-if="showPassword.conf" v-on:click="seePassword('passwordConf', 'conf')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye-slash" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

        <div v-else v-on:click="seePassword('passwordConf', 'conf')" class="cursor-pointer">
          <font-awesome icon="fa-regular fa-eye" class="text-gray-400 absolute right-4 bottom-3 seepass-btn"></font-awesome>
        </div>

      </div>
    </div>

    <div class="text-right">
      <button type="submit" class="btn bg-success hover:bg-success-dark text-white">Lanjut</button>
    </div>

  </form>
</template>

<script>

  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  export default {
    name: 'form-perubahan',
    components: {
      'font-awesome': FontAwesomeIcon
    },
    data: function() {
      return {
        password: {
          old: '',
          new: '',
          conf: ''
        },
        showPassword: {
          old: false,
          new: false,
          conf: false
        }
      }
    },
    methods: {
      seePassword: function(el, key) {
        let item = this.$refs[el];
        let inputType = (item.getAttribute('type') == 'text') ? 'password' : 'text';

        this.showPassword[key] = (item.getAttribute('type') == 'text') ? false : true;
        item.setAttribute('type', inputType);
      },
      checkPassword: function(e) {
        e.preventDefault();
        alert('submit');
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .seepass-btn {
    width: 25px;
  }

</style>