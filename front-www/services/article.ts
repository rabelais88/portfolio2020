import { AxiosResponse } from 'axios';
import { api, joinUrl, asyncResolver, resolvedResult } from '../lib/api';
import queryPaging from '../types/queryPaging';
import listResponse from '../types/listResponse';
import article from '../types/article';
import Logger from '../lib/logger';

const logger = new Logger('services/article.ts');

export const AUTH = 'auth';
export const ARTICLES = 'articles';

export async function getArticles(
  arg?: queryPaging
): Promise<resolvedResult<listResponse<article>>> {
  const url = joinUrl(ARTICLES, arg);
  const opts = {
    method: 'get',
    url: `/${url}`,
  };
  logger.log('getArticles()', { opts });
  const req = await asyncResolver<listResponse<article>>(api.request, opts);
  return req;
}