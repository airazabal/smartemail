import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

  private logLevels: any = {
    'ERROR' : 0,
    'WARN': 1,// bin '01' Only MESSAGE lines
    'INFO': 2,  // bin '10'   -- Only Info, Warn & Error Messages
    'DEBUG': 4, // bin '100'  -- Only DEBUG+ INFO + WARN + ERROR lines
    'TRACE': 7, // bin '111'  -- DEBUG + INFO + WARN +ERROR
    '*': 15 } // bin '1111' (includes) all

  private _logLevel: string = 'INFO'

  constructor() { }

  private _l(level: string): boolean {
    // this is a bitwise and so we print the log if its of certain type
    return ((this.logLevels[this._logLevel] & this.logLevels[level]) === this.logLevels[level])
  }

  error(opts: any) {
    this._l('ERROR') && console.error(opts)
  }
  info(opts: any) {
    this._l('INFO') && console.info(opts)
  }
  warn(opts: any) {
    this._l('WARN') && console.warn(opts)
  }
  debug(opts: any) {
    this._l('DEBUG') && console.debug(opts)
  }
  trace(opts: any) {
    this._l('TRACE') && console.debug(opts)
  }

  set logLevel(l: string) {
    if (this.logLevels[l]) {
      this._logLevel = l;
    } else {
      throw new Error(`Invalid logLevel: ${l}, use one of: ${Object.keys(this.logLevels)}`)
    }
  }

  get logLevel() {
    return this._logLevel
  }
}
