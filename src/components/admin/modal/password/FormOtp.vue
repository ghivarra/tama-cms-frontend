<template>
  <form v-on:submit="checkOTP" class="pb-10 tablet:pt-10">
    <h2 class="h2 text-center font-bold mb-8">Verifikasi Email</h2>
    <p class="text-center mb-8">Input kode OTP yang sudah dikirimkan ke email <b>{{ admin.adm_email }}</b></p>

    <div class="flex justify-center input-otp-group mb-6">
      
      <input v-on:keyup="nextOrPrev" v-on:paste="pasteThis" v-model="codes[n]" v-for="(item, n) in codes" v-bind:key="n" v-bind:id="`otp_${n}`" type="text" class="input-otp py-2 px-1 text-center mx-1 border-b-2 outline-none focus:border-gss-light focus:outline-none w-auto tablet:mx-2" maxlength="1" required>

    </div>

    <div class="flex justify-center">
      <button type="submit" class="btn bg-gss hover:bg-gss-dark text-white">Verifikasi</button>
    </div>

  </form>
</template>

<script>

  import { usePrivateApi } from '../../../../helper/Api';
  import Swal from 'sweetalert2';

  export default {
    name: 'form-otp',
    inject: [
      'admin',
      'changePreloadStatus'
    ],
    props: [
      'nextStep'
    ],
    data: function() {
      return {
        codes: ['', '', '', '', '', ''],
        otpInput: []
      }
    },
    methods: {
      nextOrPrev: function(e) {

        let length = e.target.value.length;
        let next = e.target.nextElementSibling;
        let prev = e.target.previousElementSibling;
        
        if (length > 0 && next !== null) {

          if (e.keyCode == 39 && next !== null) {
            next.focus();
          } else if (e.keyCode == 37 && prev !== null) {
            prev.focus();
          } else {
            next.focus();
          }

        } else if (length < 1 && prev !== null) {
          if (e.keyCode == 46 || e.keyCode == 8) {
            prev.focus();
          } else if (e.keyCode == 39 && next !== null) {
            next.focus();
          } else if (e.keyCode == 37 && prev !== null) {
            prev.focus();
          }
        } else {

          if (e.keyCode == 39 && next !== null) {
            next.focus();
          } else if (e.keyCode == 37 && prev !== null) {
            prev.focus();
          }
        }
      },
      pasteThis: function(e) {
        let app = this;

        let text = e.clipboardData.getData('text');
        text = text.substring(0, 6);
        text = text.split('');

        for (var i = 0; i < text.length; i++) {
          app.codes[i] = text[i];
        }
      },
      checkOTP: function(e) {
        e.preventDefault();

        // preload
        this.changePreloadStatus();

        // create otp
        let app = this;
        let otp = app.codes.join('');
        let postData = new FormData();
        postData.append('otp', otp);

        usePrivateApi('akun/konfirmasi-otp', {
          app: app,
          method: 'post',
          data: postData,
          success: function(res) {
            let data = res.data;
            Swal.fire({
              icon: data.status,
              title: data.title,
              text: data.message
            }).then(() => {
              app.nextStep();
            });
          },
          final: function() {
            app.changePreloadStatus();
          }
        });
      }
    },
    mounted: function() {
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .input-otp {
    width: 50px;
    font-size: 18px;
  }

  @media (max-width: 640px) {

    .input-otp {
      width: 30px;
      font-size: 16px;
    }
  }

</style>