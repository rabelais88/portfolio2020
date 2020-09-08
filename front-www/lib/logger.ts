import seedrandom from 'seedrandom';
import { checkClient } from 'lib';
import { NODE_ENV } from 'env';
import { ENV_PROD } from 'constants/nodeEnvs';

const consoleColors = [
  '#00876c',
  '#409a70',
  '#67ac75',
  '#8cbe7b',
  '#b2d083',
  '#d8e18d',
  '#fff19b',
  '#fcd580',
  '#f8b96a',
  '#f39c5b',
  '#ec7e52',
  '#e25f50',
  '#d43d51',
];

/* eslint-disable no-console */
class Logger {
  private filename: string;
  private color: string;

  constructor(_filename: string) {
    if (!_filename || _filename === '') throw Error('must specify filename');
    this.filename = _filename;
    const colorKey = Math.floor(seedrandom(_filename)() * consoleColors.length);
    this.color = consoleColors[colorKey];
    return this;
  }

  // https://github.com/vercel/next.js/issues/5354
  log(...args: any): null {
    if (NODE_ENV === ENV_PROD) return null;
    if (checkClient()) {
      console.log(`%c${this.filename} ->`, `color:${this.color}`, ...args);
      return null;
    }
    console.log(`${this.filename} ->`, ...args);
    return null;
  }

  err(...args: any): null {
    console.error(`${this.filename} ->`, ...args);
    return null;
  }
}

export default Logger;
