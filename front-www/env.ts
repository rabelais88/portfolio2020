/* eslint-disable prefer-destructuring */
// DO NOT CONNECT ANY DEPENDENCIES TO THIS FILE UNLESS NECESSARY
import processType from 'types/process';
import pkg from './package.json';
/**
 * DO NOT STORE SECRET! THE IMAGE WILL BE UPLOADED TO PUBLIC REPO
 */
/**
 * @description DO NOT destruct process.env
 * @example
 * DOES NOT WORK (x)
 * const { PORT, NODE_ENV } = process.env
 *
 * DOES WORK (o)
 * const PORT = process.env.PORT
 */

const _process = <processType>process;
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const VERSION = pkg.version;
// browser url by default
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const SERVER_API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;
export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
export const IS_BROWSER = _process.browser;
export const IS_SERVER = !IS_BROWSER;
export const GOOGLE_ANALYTICS_TRACKING_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID || '';

export default {
  NODE_ENV,
  PORT,
  VERSION,
  API_URL,
  SERVER_API_URL,
  IMAGE_URL,
  IS_BROWSER,
  IS_SERVER,
  GOOGLE_ANALYTICS_TRACKING_ID,
};
