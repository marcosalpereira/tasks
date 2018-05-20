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

@Injectable()
export class BrowserService {

  constructor(
    private electronService: ElectronService
  ) {
  }

  openAlmTrackTime(task: Task) {
    const almUrl = 'https://alm.serpro/ccm/web';
    const project = `projects/${encodeURI(task.project.name)}`;
    const action = `#action=com.ibm.team.workitem.viewWorkItem&id=${task.id}`;
    const tab = '&tab=rastreamentodehoras';
    const url = `${almUrl}/${project}${action}${tab}`;
    const cmd = `firefox "${url}"`;
    console.log(cmd);
    const output = this.electronService.childProcess.exec(cmd);
    console.log('output', output.toString());
  }

  openBiCorporativo() {
    const url = 'https://bicorporativo.serpro.gov.br/dwcorporativo/'
      + 'api/repos/%3Ahome%3ASUPDE%3APaineis%3AGestao%3Aapropriacao-empregado%3Aapropriacao-empregado.wcdf'
      + '/generatedContent';
      const cmd = `firefox "${url}"`;
      console.log(cmd);
      const output = this.electronService.childProcess.exec(cmd);
      console.log('output', output.toString());
  }


}