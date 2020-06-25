import request from '@/utils/request';
import { AUTH_REQUIRED, USER_INFO } from './path';

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data,
  });
}

export function getInfo(token) {
  const url = [AUTH_REQUIRED, USER_INFO].join('/');
  return request({
    url: `/${url}`,
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post',
  });
}

export function getLoginUrl() {
  return request({
    url: '/login',
    method: 'get',
  });
}

export function getLoginToken(query) {
  return request({
    url: '/login-cred',
    method: 'get',
    params: query,
  });
}
