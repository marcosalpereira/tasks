import { Injectable } from '@angular/core';
import { Config } from './config.model';

@Injectable()
export class ConfigService {
  private config: Config;
  public configChanged$ = new Subject<Event[]>();

  constructor() { }

  getConfig(): Config {
    if (!this.config) {
      this.config = JSON.parse(localStorage.getItem('tasks.config')) || {};
      this.fireEventsChanged();
      this.fireProjectsChanged();
      this.fireTopTasksChanged();
    }
    return this.config;
    // new Config('/home/54706424372/Documentos/apropriacao',
    //   '54706424372', 'firefox', 'selenium',
    //   '/home/54706424372/bin/firefox-dev/firefox');
  }

  setConfig(config: Config): void {
    this.config = config;

    localStorage.setItem('config', JSON.stringify(config));
    this.fireEventsChanged();
    this.fireProjectsChanged();
    this.fireTopTasksChanged();
  }

  
}
