import HelloWorld from './components/HelloWorld.vue';
import LoginIndex from './components/login/LoginIndex.vue';
import AdminIndex from './components/admin/AdminIndex.vue';
import { loggedInGuard, loggedOutGuard } from './routes-guard.js';

export default [
	
	// HOMEPAGE
	{ name: 'homepage', path: undefined, component: HelloWorld },

	// LOGIN PAGE
	{ 
		name: 'login.index', 
		path: `/${process.env.VUE_APP_LOGIN_PAGE}`, 
		component: LoginIndex, 
		beforeEnter: [loggedInGuard],
		meta: {
			view: 'LoginForm',
			title: 'Pintu Masuk'
		}
	},

	// LOGIN FORGOT PASSWORD
	{ 
		name: 'login.forgot.password', 
		path: `/${process.env.VUE_APP_LOGIN_PAGE}/lupa-password`, 
		component: LoginIndex, 
		beforeEnter: [loggedInGuard],
		meta: {
			view: 'LoginForgotPassword',
			title: 'Lupa Password'
		}
	},

	// LOGIN UBAH PASSWORD
	{ 
		name: 'login.change.password', 
		path: `/${process.env.VUE_APP_LOGIN_PAGE}/ubah-password`, 
		component: LoginIndex, 
		beforeEnter: [loggedInGuard],
		meta: {
			view: 'LoginChangePassword',
			title: 'Ubah Password'
		}
	},

	// ADMIN PAGE
	{ 
		name: 'admin.index', 
		path: '/' + process.env.VUE_APP_ADMIN_PAGE, 
		component: AdminIndex, 
		meta: {
			view: 'AdminDasbor',
			title: 'Dasbor'
		},
		beforeEnter: [loggedOutGuard]
	}
];