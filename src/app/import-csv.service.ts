import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { DataService } from './data.service';
import { Event } from './event.model';
import * as moment from 'moment';
import { Project } from './project.model';
import { Task } from './task.model';

@Injectable()
export class ImportCsvService {

  parseTask(project, item: string): Task {
    const tokens = item.split(';');
    return new Task(project, parseInt(tokens[0], 10), tokens[1]);
  }

  constructor(
    private electronService: ElectronService,
    private dataService: DataService
  ) {
  }

  importCsv(csvFile: string): void {
    this.dataService.bulkImportBegin();
    const fs = this.electronService.fs;
    const projects = new Map();

    fs.readFileSync(csvFile).toString().split('\n').forEach(line => {
      const tokens = line.split(',');
      if (tokens && tokens[0] !== 'Reg' && tokens[1]) {
        console.log(tokens);
        const registered = tokens[0] === 'Sim';
        const data = tokens[1].substring(0, 8);
        const contexto = tokens[3];
        const item = tokens[4];
        const comentario = tokens[5];
        const inicio = tokens[6];
        const fim = tokens[7];

        let project = projects[contexto];
        if (!project) {
          project = new Project(contexto);
          projects[contexto] = project;
          this.dataService.addProject(project);
        }

        const startDate = this.parseDate(data, inicio);
        const endDate = this.parseDate(data, fim);
        const task = this.parseTask(project, item);
        this.dataService.bulkImportAddEvent(task, startDate, endDate, registered, comentario);
      }
    });

    this.dataService.bulkImportEnd();

  }

  parseDate(data: string, hora: string): Date {
    if (hora) {
      const d = data + ' ' + hora;
      console.log('parse', d);
      return moment(d, 'DD/MM/YY HH.mm').toDate();
    }
    return undefined;
  }

}
