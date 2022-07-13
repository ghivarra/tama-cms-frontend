// standard vue js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Routes from './routes'
import './main.css'

// importing Library
import Axios from 'axios'
import { setCookie, getCookie } from './helper/Global';

// importing font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faBars, faXmark, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const router = createRouter({
	history: createWebHistory(),
	routes: Routes
});

const app = createApp(App);
app.use(router);
app.mount('#app-gsslit');

// GLOBAL PROPERTIES
app.config.globalProperties.axios = Axios;
app.config.globalProperties.setCookie = setCookie;
app.config.globalProperties.getCookie = getCookie;

// add fontawesome
library.add(faEye, faEyeSlash, faMagnifyingGlass, faBars, faXmark, faRightToBracket);