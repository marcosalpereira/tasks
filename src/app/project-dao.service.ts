import { Injectable } from '@angular/core';
import { Config } from './config.model';
import { ConfigService } from './config.service';
import { Project } from './project.model';
import { StorageService } from './storage.service';

@Injectable()
export class ProjectDaoService {
  private projects: Project[];

  constructor(private storageService: StorageService) {
  }

  dataInit(): void {
    this.projects = undefined;
  }

  getProjects(): Project[] {
    if (!this.projects) {
      this.projects = this.storageService.getItem('projects') || [];
    }
    return this.projects;
  }

  persist(project: Project) {
    const projects = this.getProjects();
    if (project.id) {
      const index = projects.findIndex(e => e.id === project.id);
      projects[index] = project;
    } else {
      project.id = new Date().getTime();
      projects.push(project);
    }
    this.storageService.setItem('projects', this.projects);
  }

  find(name: string): Project {
    return this.getProjects().find(p => p.name === name);
  }

}
