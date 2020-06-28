import request from '@/utils/request';
import { AUTH_REQUIRED, ARTICLES, ARTICLE, TAGS } from './path';

export function getArticles(query) {
  return request({
    url: `/${ARTICLES}`,
    method: 'get',
    params: query,
  });
}

export function getArticle(query) {
  return request({
    url: `/${ARTICLE}`,
    method: 'get',
    params: query,
  });
}

export function getTags(keyword) {
  return request({
    url: `/${TAGS}`,
    methods: 'get',
    params: { keyword },
  });
}
