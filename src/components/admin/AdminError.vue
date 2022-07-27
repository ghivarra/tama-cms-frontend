<template>
  <div></div>
</template>

<script>

  // load library
  import Swal from 'sweetalert2';

  export default {
    name: 'admin-error',
    mounted: function() {
      Swal.fire({
        title: 'Whoopss!!',
        icon: 'error',
        text: 'Anda gagal memuat halaman, periksa koneksi internet anda',
        allowOutsideClick: false,
        showCloseButton: false,
        showCancelButton: false,
        confirmButtonText: 'Reload Halaman'
      }).then(() => {
        window.location.reload(true);
      });
    }
  }

</script>