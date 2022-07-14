import HelloWorld from './components/HelloWorld.vue';
import LoginIndex from './components/login/LoginIndex.vue';
import { loggedInGuard } from './routes-guard.js';

export default [
	
	// HOMEPAGE
	{ name: 'homepage', path: undefined, component: HelloWorld },

	// LOGIN PAGE
	{ 
		name: 'login.index', 
		path: '/' + process.env.VUE_APP_LOGIN_PAGE, 
		component: LoginIndex, 
		beforeEnter: [loggedInGuard],
		meta: {
			view: 'LoginForm'
		}
	},

	// ADMIN PAGE
	{ 
//		name: 'admin.index', 
//		path: '/' + process.env.VUE_APP_ADMIN_PAGE, 
//		component: AdminIndex, 
//		meta: {
//			mainComponent: 'AdminDasbor'
//		},
//		beforeEnter: [loggedOutGuard]
	}
];