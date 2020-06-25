import request from '@/utils/request';
import { AUTH_REQUIRED, ARTICLES } from './path';

export function getArticles(query) {
  return request({
    url: `/${ARTICLES}`,
    method: 'get',
    params: query,
  });
}
