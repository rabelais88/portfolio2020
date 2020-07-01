import request from '@/utils/request';
import { AUTH_REQUIRED, ARTICLES, ARTICLE, TAGS } from './path';

export function getArticles(query) {
  return request({
    url: `/${ARTICLES}`,
    method: 'get',
    params: query,
  });
}

export function getArticle(articleId) {
  return request({
    url: `/${ARTICLE}`,
    method: 'get',
    params: { id: articleId },
  });
}

export function getTags(keyword = '') {
  const opts = {
    url: `/${TAGS}`,
    methods: 'get',
  };
  if (keyword !== '') opts.params = { keyword };
  return request(opts);
}

export function removeArticle(articleId) {
  const url = [AUTH_REQUIRED, ARTICLE].join('/');
  return request.delete(`/${url}`, {
    params: { articleId },
  });
}
