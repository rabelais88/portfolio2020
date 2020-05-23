import axios from 'axios';
import { resolverFunc } from './index';

export const asyncResolver: resolverFunc = (_func, ..._args) => {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    try {
      _func(..._args)
        .then((res) => {
          return resolve({ error: null, result: res, errorCode: null });
        })
        .catch((err) => {
          const errorCode = (err.data || {}).statusCode || -1;
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

export const api = axios;

export default api;
