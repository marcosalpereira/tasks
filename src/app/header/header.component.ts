import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../electron.service';
import { DataService } from '../data.service';
import { Config } from '../config.model';
import { DateUtil } from '../date-util';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private config: Config;

  constructor(
    private electronService: ElectronService,
    private dataService: DataService
  ) {
    this.config = dataService.getConfig();
  }

  doIt() {
    const fs = this.electronService.fs;
    const path = this.electronService.path;
    const csvFile = this.writeCsvFile();
    const script = path.resolve(this.config.workFolder, 'apropriacao.sh');
    const jarFile = path.resolve(this.config.workFolder, 'alm-apropriator-2.10.jar');
    const cmd = `${script} ${jarFile} ${csvFile}`;
    const stdout = this.electronService.childProcess.execSync(cmd);
    console.log('stdout', stdout.toString());
  }

  private writeCsvFile(): string {
    const csvFile = this.electronService.path.resolve(this.config.workFolder, 'sgi.csv');
    const data = this.convertEventsToCsv();
    this.electronService.fs.writeFileSync(csvFile, data);
    return csvFile;
  }

  private convertEventsToCsv(): string {
    const config = this.config;
    const events = this.dataService.getEvents();
    const data: string[] = [];

    let row = 1;
    const regs = events
      .map(event => {
        const cols: any[] = [];
        const start = moment(event.startDate);
        const end = moment(event.endDate);

        cols.push('reg');
        cols.push(row++);
        cols.push(event.registered ? 'Sim' : 'Não');
        cols.push(start.format('dd/MM/yy'));
        cols.push('');
        cols.push(event.task.project.name);
        cols.push(event.task.id + ';' + event.task.name);
        cols.push(event.remarks);
        cols.push(start.format('HH:mm'));
        cols.push(end.format('HH:mm'));
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
    data.push(`cfg|browser.firefox.profile|${config.browserFirefoxProfile}`);
    data.push(`cfg|browser.location|${config.browserLocation}`);

    return data.join('\n')
      .concat(regs.join('\n'));

  }

}
