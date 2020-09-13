/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
import axios from 'axios';
import { API_URL, SERVER_API_URL, IS_SERVER } from '../env';
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

const baseURL = IS_SERVER && SERVER_API_URL ? SERVER_API_URL : API_URL;
if (IS_SERVER && !SERVER_API_URL)
  logger.log(
    'missing SERVER_API_URL, falls back to default client API_URL for SERVER_API_URL'
  );
logger.log('api initialized', {
  API_URL,
  SERVER_API_URL,
  baseURL,
  processEnv: process.env.NEXT_PUBLIC_API_URL,
});
export const api = axios.create({ baseURL });

export default api;
