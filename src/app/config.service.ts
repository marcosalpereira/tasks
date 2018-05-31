import { Injectable } from '@angular/core';
import { Config } from './config.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ConfigService {
  public configChanged$ = new Subject<Config>();

  constructor() { }

  getConfig(): Config {
    return JSON.parse(localStorage.getItem('tasks.config')) || {};
  }

  setConfig(config: Config): void {
    localStorage.setItem('tasks.config', JSON.stringify(config));
    this.configChanged$.next(config);
  }

}
