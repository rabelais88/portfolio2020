import Cookies from 'js-cookie';

const KEY_ADMIN_TOKEN = 'KEY_ADMIN_TOKEN';
const KEY_USER_UPDATED = 'KEY_USER_UPDATED';

export function getToken() {
  return Cookies.get(KEY_ADMIN_TOKEN) || null;
}

export function setToken(token) {
  return Cookies.set(KEY_ADMIN_TOKEN, token);
}

export function removeToken() {
  return Cookies.remove(KEY_ADMIN_TOKEN);
}

export function getUserUpdatedAt() {
  return Cookies.get(KEY_USER_UPDATED);
}

export function setUserUpdatedAt(timestamp) {
  return Cookies.set(KEY_USER_UPDATED, timestamp);
}

export function removeUserUpdatedAt() {
  return Cookies.remove(KEY_USER_UPDATED);
}
