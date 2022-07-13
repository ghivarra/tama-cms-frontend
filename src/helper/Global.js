/**/

export const setCookie = (cookieName, cookieValue, cookieExpire, cookieDomain, cookieSameSite, cookiePath) => {

  // if empty
  cookieExpire = (cookieExpire == undefined) ? 0 : cookieExpire; // expire in seconds
  cookieDomain = (cookieDomain == undefined) ? location.hostname : cookieDomain;
  cookieSameSite = (cookieSameSite == undefined) ? 'Strict' : cookieSameSite;
  cookiePath = (cookiePath == undefined) ? '/' : cookiePath;

  // create expiration date
  let date = new Date();
  date.setTime(date.getTime() + cookieExpire);

  // create cookie
  try {

    document.cookie = `${cookieName}=${cookieValue}; expires=${date.toUTCString()}; Max-Age=${cookieExpire}; path=${cookiePath}; SameSite=${cookieSameSite}; domain: ${cookieDomain};`;
    return true;

  } catch(e) {

    console.log(e);
    return false;
  }
}

export const getCookie = (cookieName) => {
  let name = cookieName + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
}

export const imageURL = (slug) => {
  return (slug == undefined) ? process.env.VUE_APP_IMAGE_BASE_URL : process.env.VUE_APP_IMAGE_BASE_URL + slug;
}

export const baseURL = (slug) => {
  return (slug == undefined) ? process.env.VUE_APP_BASE_URL : process.env.VUE_APP_BASE_URL + slug;
}

export const adminURL = (slug) => {
  return (slug == undefined) ? `${process.env.VUE_APP_BASE_URL}/${process.env.VUE_APP_ADMIN_PAGE}` : `${process.env.VUE_APP_BASE_URL}/${process.env.VUE_APP_ADMIN_PAGE}/${slug}`;
}