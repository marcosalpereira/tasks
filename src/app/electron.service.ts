import { remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class ElectronService {
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  remote: typeof remote;
  os: typeof os;

  constructor() {
    if (this.isElectron()) {
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
      this.remote = window.require('electron').remote;
      this.os = window.require('os');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
