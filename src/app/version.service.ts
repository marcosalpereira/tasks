import { Injectable } from '@angular/core';
import { Task } from './task.model';

const CURRENT_VERSION = '1';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  constructor() { }

  migrateData() {
    this.migrate(null, CURRENT_VERSION);
  }

  defineCurrentVersion() {
    localStorage.setItem('tasks.version', CURRENT_VERSION);
  }

  private migrate(from: string, to: string) {
    const version = localStorage.getItem('tasks.version');
    console.log({version});
    if (from !== version) { return; }

    const newItens = new Map();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      if (key.indexOf('.tasks.') !== -1) {
        const task: Task = JSON.parse(value);
        task.id = task.code;
        newItens[key] = JSON.stringify(task);
      } else if (key === 'tasks.version') {
        // ignore
      } else {
        newItens[key] = value;
      }
    }

    localStorage.clear();
    for (const [key, value] of Object.entries(newItens)) {
      localStorage.setItem(key, value);
    }
    localStorage.setItem('tasks.version', to);
  }
}
