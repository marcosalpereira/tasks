import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from './electron.service';
import { DataService } from './data.service';
import { Config } from './config.model';
import { DateUtil } from './date-util';
import * as moment from 'moment';
import { MessagesService } from './messages.service';
import { Event } from './event.model';
import { Task } from './task.model';
import { ConfigService } from './config.service';

@Injectable()
export class BrowserService {

  constructor(
    private electronService: ElectronService,
    private configService: ConfigService,
  ) {
  }

  openAlmTrackTime(task: Task) {
    const almUrl = 'https://alm.serpro/ccm/web';
    const project = `projects/${encodeURI(task.project.name)}`;
    const action = `#action=com.ibm.team.workitem.viewWorkItem&id=${task.code}`;
    const tab = '&tab=rastreamentodehoras';
    const url = `${almUrl}/${project}${action}${tab}`;
    const browser = this.getBrowser();
    const cmd = `${browser} "${url}"`;
    console.log(cmd);
    const output = this.electronService.childProcess.exec(cmd);
    console.log('output', output.toString());
  }

  getBrowser() {
    const config = this.configService.getConfig();
    if (config.browserLocation) {
      return config.browserLocation;
    }
    return 'fiefox';
  }

  openBiCorporativo() {
    const url = 'https://bicorporativo.serpro.gov.br/dwcorporativo/'
      + 'api/repos/%3Ahome%3ASUPDE%3APaineis%3AGestao%3Aapropriacao-empregado%3Aapropriacao-empregado.wcdf'
      + '/generatedContent';
      const browser = this.getBrowser();
      const cmd = `${browser} "${url}"`;
      console.log(cmd);
      const output = this.electronService.childProcess.exec(cmd);
      console.log('output', output.toString());
  }


}
