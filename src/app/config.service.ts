import { Injectable } from '@angular/core';
import { Config } from './config.model';

@Injectable()
export class ConfigService {

  constructor() { }

  getConfig(): Config {
    return JSON.parse(localStorage.getItem('tasks.config')) || undefined;
  }
}
