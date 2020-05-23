/* eslint-disable @typescript-eslint/no-explicit-any */

export interface resolvedResult {
  error?: Error;
  result: any;
  errorCode?: number;
}

export interface resolverFunc {
  // eslint-disable-next-line
  (_func: Function, ..._args: any[]): Promise<resolvedResult>;
}
