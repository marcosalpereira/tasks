import { Injectable } from '@angular/core';
import { Config } from './config.model';
import { ConfigService } from './config.service';
import { Project } from './project.model';

@Injectable()
export class ProjectDaoService {
  private projects: Project[];
  private config: Config;

  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }

  getProjects(): Project[] {
    if (!this.projects) {
      const key = 'tasks.projects';
      this.projects = JSON.parse(localStorage.getItem(key)) || [];
    }
    return this.projects;
  }

  persist(project: Project) {
    if (!project.id) {
      project.id = new Date().getTime();
      this.projects.push(project);
    }
    const key = 'tasks.projects';
    localStorage.setItem(key, JSON.stringify(this.projects));
  }

  find(name: string): Project {
    return this.getProjects().find(p => p.name === name);
  }

}
