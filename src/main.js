// standard vue js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Routes from './routes'
import './main.css'

// importing font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faAlignLeft, faXmark, faRightToBracket, faRightFromBracket, faChevronDown, faChevronUp, faUserGear, faKey, faImage, faCircleCheck, faUniversalAccess, faGears, faTableColumns, faChevronLeft, faChevronRight, faPlus, faBars, faArrowLeft, faRotate } from '@fortawesome/free-solid-svg-icons';

const router = createRouter({
	history: createWebHistory(),
	routes: Routes
});

const app = createApp(App);
app.use(router);
app.mount('#app-gsslit');

// GLOBAL PROPERTIES
app.config.unwrapInjectedRef = true;

// add fontawesome
library.add(faEye, faEyeSlash, faMagnifyingGlass, faAlignLeft, faXmark, faRightToBracket, faRightFromBracket, faChevronDown, faChevronUp, faUserGear, faKey, faImage, faCircleCheck, faUniversalAccess, faGears, faTableColumns, faCircle, faChevronLeft, faChevronRight, faPlus, faBars, faArrowLeft, faRotate);