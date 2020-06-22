/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
import axios from 'axios';
import qs from 'qs';
import { API_URL } from '../env';
import Logger from './logger';

const logger = new Logger('api.ts');

export interface resolvedResult<T> {
  error?: Error;
  result?: T;
  errorCode?: number;
}

export interface resolverFunc {
  // eslint-disable-next-line
  <T = any>(_func: Function, ..._args: any[]): Promise<resolvedResult<T>>;
}

/**
 * @function asyncResolver
 * @example
 * const req = await asyncResolver<MyResponse>(axios.get, 'posts/1');
 * if (req.error) {
 *   handleError(req.errorCode);
 *   return null;
 * }
 * return req.result // :MyResponse(nullable)
 */
export const asyncResolver: resolverFunc = (_func, ..._args) => {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    try {
      _func(..._args)
        .then((res) => {
          if ((res || {}).data)
            return resolve({ error: null, result: res.data, errorCode: null });
          return resolve({ error: null, result: res, errorCode: null });
        })
        .catch((err) => {
          const res = err.response || {};
          const data = res.data || {};
          const errorCode = data.statusCode || -1;
          return resolve({
            error: err,
            result: null,
            errorCode,
          });
        });
    } catch (err) {
      return resolve({ error: err, result: null, errorCode: -1 });
    }
  });
};

/**
 * @function joinUrl
 * @example
 * const url = joinUrl(['api', 'post'], {page: 1, pageSize: 10});
 * url === 'api/post?page=1&pageSize=10';
 * const urlB = joinUrl('myUrl', { service: 'aaa' });
 * urlB === 'myUrl?service=aaa';
 * const urlC = joinUrl(['abc','def']);
 * urlC === 'abc/def';
 */
// eslint-disable-next-line
export function joinUrl(urls: string[] | string, query?: any): string {
  const url = typeof urls === 'string' ? urls : urls.join('/');
  if (!query) return url;
  const _query = qs.stringify(query);
  return `${url}?${_query}`;
}

logger.log({ API_URL, processEnv: process.env.NEXT_PUBLIC_API_URL });
export const api = axios.create({
  baseURL: API_URL,
});

export default api;
