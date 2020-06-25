import request from '@/utils/request';
import { AUTH_REQUIRED, POST } from './path';

export function addPost(data) {
  const url = [AUTH_REQUIRED, POST].join('/');
  return request({
    url: `/${url}`,
    method: 'post',
    data,
  });
}
