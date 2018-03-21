import { Injectable, OnInit } from '@angular/core';
import { Project } from './project.model';

@Injectable()
export class DataService {

  addProject(project: Project): void {
    const projects: Project[] = this.getProjects();
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
  }
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
