import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from './electron.service';
import { DataService } from './data.service';
import { Config } from './config.model';
import { DateUtil } from './date-util';
import * as moment from 'moment';
import { MessagesService } from './messages.service';
import { Event } from './event.model';
import { ConfigService } from './config.service';

@Injectable()
export class ApropriateService {

  private events: Event[];

  constructor(
    private electronService: ElectronService,
    private dataService: DataService,
    private alertService: MessagesService,
    private configService: ConfigService
  ) {
  }

  private getConfig() {
    return this.configService.getConfig();
  }

  apropriate(callback) {
    try {
      this.events = this.dataService.getEvents()
        .filter((event: Event) => event.endDate);

      this.alertService.clear();
      const path = this.electronService.path;
      const csvFile = this.writeCsvFile();
      const script = path.resolve(this.getConfig().workFolder, 'apropriacao.sh');
      const jarFile = path.resolve(this.getConfig().workFolder, this.getLastJarFile());
      const cmd = `${script} ${jarFile} ${csvFile}`;
      console.log(cmd);
      const output = this.electronService.childProcess.execSync(cmd);
      this.readReturnFile();
    } catch (e) {
      console.log(e);
    }
    callback();
  }

  getLastJarFile(): any {
    const fs = this.electronService.fs;
    const er = /^alm\-apropriator\-(\d+)\.(\d+)\.jar/;
    const jars: string[][] = fs.readdirSync(this.getConfig().workFolder)
      .map(s => er.exec(s))
      .filter(g => g !== null)
      .sort((ga, gb) => this.parseVersion(gb) - this.parseVersion(ga));
    return jars[0][0];
  }

  private parseVersion(g: string[]): number {
    return +g[1] * 1000 + +g[2];
  }


  private readReturnFile() {
    const retFile = this.electronService.path.resolve(this.getConfig().workFolder, 'sgi.ret');

    this.electronService.fs.readFileSync(retFile).toString().split('\n').forEach(line => {
      const tokens = line.split('|');
      if (tokens) {
        const type = tokens[0];
        if (type === 'err') {
          this.alertService.error(tokens[1]);
        } else if (type === 'mcr') {
          const index = +tokens[1];
          this.dataService.markEventAsRegistered(this.events[index]);
        }
      }
    });
    this.dataService.fireEventsChanged();

  }

  private writeCsvFile(): string {
    const csvFile = this.electronService.path.resolve(this.getConfig().workFolder, 'sgi.csv');
    const data = this.convertEventsToCsv();
    this.electronService.fs.writeFileSync(csvFile, data);
    return csvFile;
  }

  private convertEventsToCsv(): string {
    const config = this.getConfig();
    const data: string[] = [];

    const regs = this.events
      .map((event: Event, index: number) => {
        const cols: any[] = [];
        const start = moment(event.startDate);
        const end = moment(event.endDate);

        cols.push('reg');
        cols.push(index);
        cols.push(event.registered ? 'Sim' : 'Não');
        cols.push(start.format('DD/MM/YY'));
        cols.push('');
        cols.push(event.task.project.name);
        cols.push(event.task.code + ';' + event.task.name);
        cols.push(event.remarks);
        cols.push(start.format('HH.mm'));
        cols.push(end.format('HH.mm'));
        cols.push(DateUtil.durationMinutes(start, end));
        cols.push('');
        cols.push('');
        cols.push('');
        cols.push('');
        return cols.join('|');
      });

    data.push(`cfg|version|1.13`);
    data.push(`cfg|login.cpf|${config.cpf}`);
    data.push(`cfg|browser.type|${config.browserType}`);
    if (config.browserFirefoxProfile) { data.push(`cfg|browser.firefox.profile|${config.browserFirefoxProfile}`) };
    data.push(`cfg|browser.location|${config.browserLocation}`);

    return data.join('\n')
      .concat('\n')
      .concat(regs.join('\n'));

  }

}
