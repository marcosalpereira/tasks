import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { DataService } from './data.service';
import { Event } from './event.model';
import * as moment from 'moment';
import { Project } from './project.model';
import { Task } from './task.model';

@Injectable()
export class ImportCsvService {

  constructor(
    private electronService: ElectronService,
    private dataService: DataService
  ) {
  }

  importCsv(csvFile: string): void {
    this.dataService.bulkImportBegin();
    const fs = this.electronService.fs;
    let previousEvent: Event;
    const events: Event[] = [];

    fs.readFileSync(csvFile).toString().split('\n')
      .map (line => line.split(','))
      .filter(tokens => tokens.length > 1 && tokens[0] !== 'Reg' && tokens[1])
      .map(tokens => {
        const data = tokens[1].substring(0, 8);
        const workItem = tokens[4].split(';');
        const linha = {
          registered: tokens[0] === 'Sim',
          projectName: tokens[3],
          taskCode: +workItem[0],
          taskName: workItem[1],
          remarks: tokens[5],
          startDate: this.parseDate(data, tokens[6]),
          endDate: this.parseDate(data, tokens[7])
        };
        // console.log('linha', linha);
        return linha;
      })
      .sort( (l, r) => l.startDate.getTime() - r.startDate.getTime())
      .forEach(line => {
        const project = this.dataService.bulkImportAddProject(line.projectName);
        const task = this.dataService.bulkImportAddTask(project, line.taskCode, line.taskName);
        previousEvent = this.dataService.bulkImportAddEvent(previousEvent,
            task, line.startDate, line.endDate, line.registered, line.remarks);
        events.push(previousEvent);
    });

    // set the property event.next
    let nextEvent: Event;
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      event.next = nextEvent;
      nextEvent = event;
      this.dataService.bulkImportPersistEvent(event);
    }

    this.dataService.bulkImportEnd();

  }

  parseDate(data: string, hora: string): Date {
    if (hora) {
      const d = data + ' ' + hora;
      return moment(d, 'DD/MM/YY HH.mm').toDate();
    }
    return undefined;
  }


}

interface Linha {
  registered: boolean;
  projectName: string;
  taskCode: number;
  taskName: string;
  startDate: Date;
  endDate: Date;
  remarks: string;
}

