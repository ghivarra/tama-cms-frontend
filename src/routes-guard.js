import { getCookie } from './helper/Global';

const isLoggedIn = () => {
	return (getCookie(process.env.VUE_APP_AUTH_KEY) == process.env.VUE_APP_AUTH_PASS) ? true : false;
}

export function loggedInGuard() {

	if(isLoggedIn()) {
		return { name: 'admin.index' };
	}
}

export function loggedOutGuard() {

	if(!isLoggedIn()) {
		return { name: 'login.index' };
	}
}