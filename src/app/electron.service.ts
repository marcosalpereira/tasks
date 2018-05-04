import { app } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

export class ElectronService {
  process: typeof process;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;

  constructor() {
    if (this.isElectron()) {
      this.process = process;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
