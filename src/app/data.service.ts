import { Injectable, OnInit } from '@angular/core';
import { Project } from './project.model';

@Injectable()
export class DataService {

  constructor() {
    localStorage.clear();
    const projects = [ new Project('Almoço'), new Project('Merenda'), new Project('Janta')];
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  getProjects(): Project[] {
    const s = localStorage.getItem('projects');
    return JSON.parse(s);
  }

}
