import { swalError } from './Error';
import { setCookie } from './Global';
import Axios from 'axios';
import Swal from 'sweetalert2';

const authenticatedCookie = process.env.VUE_APP_AUTH_KEY;
const authenticatedSign = process.env.VUE_APP_AUTH_PASS;

export const auth = (url, options) => {

	let app  = options.app;
  let data = options.data;

  // set configuration
  Axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

  // post login data
  Axios.post(url, data, {
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    withCredentials: true
  })
    .then(function(response) {

      // store token in cookie
      setCookie(authenticatedCookie, authenticatedSign, 7200);

      if (typeof options.success === 'function'){
        options.success(response);
      }

    })
    .catch(function(error) {

      if (error.response) {
				if (error.response.status == 406) {
					// store token in cookie
					setCookie(authenticatedCookie, authenticatedSign, 7200);
					app.$router.push({name: 'admin.index'});
				}

        if (error.response.data != undefined) {

          let data = error.response.data;
          Swal.fire({
            icon: data.status,
            title: data.title,
            html: data.message
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan Perubahan',
            text: 'Server sedang sibuk silahkan coba lagi'
          }).then(() => {
            if (process.env.NODE_ENV != 'development') {
              console.clear();
            }
          });

        }

				// error tapi muncul response dari server
        if (typeof options.catch === 'function'){
          options.catch(error);
        }
        
      } else if (error.request) {
        // erorr antara error server atau koneksi bermasalah
        swalError({
          title: 'Autentikasi Gagal',
          icon: 'error',
          message: 'Periksa koneksi internet anda',
          confirmButtonText: 'Muat Ulang'
        }, function() {
          app.$router.go();
        });

      } else {

        if(process.env.NODE_ENV == 'development') {
          console.log(error);
        }

        // kesalahan js, biasanya browser compatibility
        swalError({
          title: 'Autentikasi Gagal',
          icon: 'error',
          message: 'Update browser anda menggunakan versi terbaru. Bila anda menggunakan browser bawaan maka gunakan salah satu dari: Chrome, Opera, dan Firefox',
          confirmButtonText: 'OK'
        });
      }
    })
    .then(function() {

      // final / always run
      if (typeof options.final === 'function'){
        options.final();
      }

    });
}

export const usePublicApi = (url, options) => {

  // get options
	let app    = options.app;
	let data   = options.data;
  let method = (options.method == undefined) ? 'get' : options.method;

  if (Axios == undefined)
  {
    console.log(url) ;
  }

  // set configuration
  Axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

  // config
  let axiosConfig = {};

  if (method == 'get') {

		axiosConfig = {
			withCredentials: true,
			method: method
		};

  } else if(method == 'post') {

		axiosConfig = {
			withCredentials: true,
			method: method,
			data: data,
			headers: {'content-type': 'application/x-www-form-urlencoded'}
    };
  }

  // use axios
  Axios.request(url, axiosConfig)
    .then(function (response) {

      if (typeof options.success === 'function'){
        options.success(response);
      }

    })
    .catch(function (error) {

			if (error.response) {

        if (error.response.status == 406) {
          // store token in cookie
          setCookie(authenticatedCookie, authenticatedSign, 7200);
          app.$router.push({name: 'admin.index'});
        }

        // error tapi muncul response dari server
        if (typeof options.catch === 'function'){
          options.catch(error);
        }

        if (error.response.data != undefined) {

          let data = error.response.data;
          Swal.fire({
            icon: data.status,
            title: data.title,
            html: data.message
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan Perubahan',
            text: 'Server sedang sibuk silahkan coba lagi'
          }).then(() => {
            if (process.env.NODE_ENV != 'development') {
              console.clear();
            }
          });
        }
        
      } else if (error.request) {
        // erorr antara error server atau koneksi bermasalah
        swalError({
          title: 'Gagal Memuat Halaman',
          icon: 'error',
          message: 'Periksa koneksi internet anda',
          confirmButtonText: 'Muat Ulang'
        }, function() {
          app.$router.go();
        });

      } else {

				if(process.env.NODE_ENV == 'development') {
					console.log(error);
				}

        // kesalahan js, biasanya browser compatibility
        swalError({
          title: 'Gagal Memuat Halaman',
          icon: 'error',
          message: 'Update browser anda menggunakan versi terbaru. Bila anda menggunakan browser bawaan maka gunakan salah satu dari: Chrome, Opera, dan Firefox',
          confirmButtonText: 'OK'
        });
      }
    })
    .then(function () {

      // final / always run
      if (typeof options.final === 'function'){
        options.final();
      }

    });
}

export const usePrivateApi = (url, options) => {
	// get options
	let app    = options.app;
	let data   = options.data;
  let method = (options.method == undefined) ? 'get' : options.method;

  // perpanjang sesi
  setCookie(authenticatedCookie, authenticatedSign, 7200);

  // set configuration
  Axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

  // config
  let axiosConfig = {};

  if (method == 'get') {

		axiosConfig = {
			withCredentials: true,
			method: method
		};

  } else if(method == 'post') {

		axiosConfig = {
			withCredentials: true,
			method: method,
			data: data,
			headers: {'content-type': 'application/x-www-form-urlencoded'}
	}

  }

  // use axios
  Axios.request(url, axiosConfig)
    .then(function (response) {

      if (typeof options.success === 'function'){
        options.success(response);
      }

    })
    .catch(function (error) {

			if (error.response) {

				if (error.response.status == 401) {

					// store token in cookie
					setCookie(authenticatedCookie, authenticatedSign, 0);
					app.$router.push({name: 'login.index'});

				}

        if (error.response.data != undefined) {

          let data = error.response.data;
          Swal.fire({
            icon: data.status,
            title: data.title,
            html: data.message
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan Perubahan',
            text: 'Server sedang sibuk silahkan coba lagi'
          }).then(() => {
            if (process.env.NODE_ENV != 'development') {
              console.clear();
            }
          });
        }
        
        // error tapi muncul response dari server
        if (typeof options.catch === 'function'){
          options.catch(error);
        }
        
      } else if (error.request) {
        // erorr antara error server atau koneksi bermasalah
        swalError({
          title: 'Gagal Memuat Halaman',
          icon: 'error',
          message: 'Periksa koneksi internet anda',
          confirmButtonText: 'Muat Ulang'
        }, function() {
          app.$router.go();
        });

      } else {

				if(process.env.NODE_ENV == 'development') {
					console.log(error);
				}

        // kesalahan js, biasanya browser compatibility
        swalError({
          title: 'Gagal Memuat Halaman',
          icon: 'error',
          message: 'Update browser anda menggunakan versi terbaru. Bila anda menggunakan browser bawaan maka gunakan salah satu dari: Chrome, Opera, dan Firefox',
          confirmButtonText: 'OK'
        });
      }
    })
    .then(function () {

      // final / always run
      if (typeof options.final === 'function'){
        options.final();
      }

    });
}