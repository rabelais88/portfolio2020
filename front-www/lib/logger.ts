import seedrandom from 'seedrandom';
import { IS_BROWSER } from '../env';

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

  checkBrowser(): boolean {
    return IS_BROWSER;
  }

  log(...args: any): null {
    if (this.checkBrowser()) {
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
