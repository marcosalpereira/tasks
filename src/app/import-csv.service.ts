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

    fs.readFileSync(csvFile).toString().split('\n').forEach(line => {
      const tokens = line.split(',');
      if (tokens && tokens[0] !== 'Reg' && tokens[1]) {
        const registered = tokens[0] === 'Sim';
        const data = tokens[1].substring(0, 8);
        const projectName = tokens[3];
        const workItem = tokens[4].split(';');
        const comentario = tokens[5];
        const inicio = tokens[6];
        const fim = tokens[7];

        const project = this.dataService.bulkImportAddProject(projectName);
        const task = this.dataService.bulkImportAddTask(project, +workItem[0], workItem[1]);

        const startDate = this.parseDate(data, inicio);
        const endDate = this.parseDate(data, fim);
        previousEvent = this.dataService.bulkImportAddEvent(previousEvent,
            task, startDate, endDate, registered, comentario);
        events.push(previousEvent);
      }
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
