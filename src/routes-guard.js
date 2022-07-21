import { getCookie } from './helper/Global';

export const isLoggedIn = () => {
	return (getCookie(process.env.VUE_APP_AUTH_KEY) == process.env.VUE_APP_AUTH_PASS) ? true : false;
}

export const loggedInGuard = () => {

	if(isLoggedIn()) {
		return { name: 'admin.index' };
	}
}

export const loggedOutGuard = () => {

	if(!isLoggedIn()) {
		return { name: 'login.index' };
	}
}