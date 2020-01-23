import { app, remote } from 'electron';
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
  app: typeof app;

  constructor() {
    if (this.isElectron()) {
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
      this.os = window.require('os');

      const electron = window.require('electron');
      this.remote = electron.remote;
      this.app = this.remote.app;
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  reload() {
    this.app.relaunch();
    this.app.exit(0);
  }

}
