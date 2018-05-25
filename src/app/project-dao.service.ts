import { Injectable } from '@angular/core';
import { Config } from './config.model';
import { ConfigService } from './config.service';
import { Project } from './project.model';

@Injectable()
export class ProjectDaoService {

  private config: Config;
  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }

  private persist(project: Project) {
    const key = this.getKey(project.name);
    localStorage.setItem(key, JSON.stringify(project));
  }

  private find(id: string): Project {
    const key = this.getKey(id);
    return JSON.parse(localStorage.getItem(key)) || undefined;
  }

  getKey(id: string): string {
    return `ev-${id}`;
  }


}
