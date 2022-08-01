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

export const range = (size, startAt = 0) => {
    return [...Array(size).keys()].map(i => i + startAt);
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

export const createModal = (status) => {
  let body = document.querySelector('body');
  let hg = resetHeight();

  if (status) {
    body.classList.remove('modal-open');
    let bg = document.querySelectorAll('.modal-backdrop');
    if (bg.length > 0) {
      for (var i = 0; i < bg.length; i++) {
        bg[i].remove();
      }
    }  
  } else {
    let backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');
    body.appendChild(backdrop);
    body.classList.add('modal-open');

    if (window.innerWidth < 640) {
      setTimeout(() => {
        let noFooter = document.querySelector('.modal-content-body.no-footer');
        let withFooter = document.querySelector('.modal-content-body');
        if (noFooter == undefined) {
          withFooter.style.height = `calc(${hg}px - 136px)`;
        } else {
          noFooter.style.height = `calc(${hg}px - 63px)`;
        }
      }, 50);
    }
  }

  return;
}

export const formatNumber = (num, separator) => {
  separator = (separator == undefined) ? '.' : separator;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export const resetHeight = () => {
  document.body.style.height = window.innerHeight + "px";
  return window.innerHeight;
}