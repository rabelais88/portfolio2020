import { AxiosResponse } from 'axios';
import { api, joinUrl, asyncResolver, resolvedResult } from '../lib/api';
import queryPaging from '../types/queryPaging';
import listResponse from '../types/listResponse';
import article from '../types/article';

export const AUTH = 'auth';
export const ARTICLES = 'articles';

export async function getArticles(
  arg?: queryPaging
): Promise<resolvedResult<AxiosResponse<listResponse<article>>>> {
  const url = joinUrl(ARTICLES, arg);
  const opts = {
    method: 'get',
    url: `/${url}`,
  };
  const req = await asyncResolver<AxiosResponse<listResponse<article>>>(
    api.request,
    opts
  );
  return req;
}
