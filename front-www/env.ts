/* eslint-disable prefer-destructuring */
import pkg from './package.json';

/**
 * @description DO NOT destruct process.env
 * @example
 * DOES NOT WORK
 * const { PORT, NODE_ENV } = process.env
 * DOES WORK
 * const PORT = process.env.PORT
 */
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const VERSION = pkg.version;

export default {
  NODE_ENV,
  PORT,
  VERSION,
};
