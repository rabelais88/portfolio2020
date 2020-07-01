import request from '@/utils/request';
import { AUTH_REQUIRED, WORK } from './path';

export function addWork(data) {
  const url = [AUTH_REQUIRED, WORK].join('/');
  return request({
    url: `/${url}`,
    method: 'post',
    data,
  });
}

export function modifyWork(data) {
  const url = [AUTH_REQUIRED, WORK].join('/');
  return request({
    url: `/${url}`,
    method: 'put',
    data,
  });
}
