import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from './electron.service';
import { DataService } from './data.service';
import { Config } from './config.model';
import { DateUtil } from './date-util';
import * as moment from 'moment';
import { MessagesService } from './messages.service';
import { Event } from './event.model';

@Injectable()
export class ExportCsvService {

  private config: Config;

  constructor(
    private electronService: ElectronService,
    private dataService: DataService,
    private alertService: MessagesService
  ) {
    this.config = dataService.getConfig();
  }

  exportCsv(): void {
    this.alertService.clear();
    const csvFile = this.electronService.path.resolve(this.config.workFolder, `dados-${new Date().getTime()}.csv`);
    const data = this.convertEventsToCsv();
    this.electronService.fs.writeFileSync(csvFile, data);
    this.alertService.info(`Exported to ${csvFile}`);
  }

  private convertEventsToCsv(): string {
    const config = this.config;
    const data: string[] = [];

    const events =
      this.dataService.getEvents()
        .reverse();

    const regs = events
      .map( (event: Event, index: number) => {
        const cols: any[] = [];
        const start = moment(event.startDate);
        const end = moment(event.endDate);

        cols.push(event.registered ? 'Sim' : 'Não');
        cols.push(start.format('DD/MM/YY'));
        cols.push(event.task.project.name);
        cols.push(event.task.code + ';' + event.task.name);
        cols.push(event.remarks);
        cols.push(start.format('HH.mm'));
        cols.push(end.format('HH.mm'));
        return cols.join('|');
      });

    return regs.join('\n');
  }

}
