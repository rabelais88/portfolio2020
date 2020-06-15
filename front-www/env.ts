/* eslint-disable prefer-destructuring */
import pkg from './package.json';

/**
 * @description DO NOT destruct process.env
 * @example
 * DOES NOT WORK (x)
 * const { PORT, NODE_ENV } = process.env
 *
 * DOES WORK (o)
 * const PORT = process.env.PORT
 */
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const VERSION = pkg.version;
export const API_URL = process.env.API_URL;

export default {
  NODE_ENV,
  PORT,
  VERSION,
  API_URL,
};
