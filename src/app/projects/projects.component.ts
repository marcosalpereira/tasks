import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Project } from '../project.model';
import { Subject } from 'rxjs/Subject';


class SelectedProject {
  constructor(public project: Project, public checked: boolean = false) {}
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public projectFilter = new Subject<Project[]>();


  projects: SelectedProject[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getProjects().forEach(project =>
      this.projects.push(new SelectedProject(project))
    );
  }

  onChange() {
    const selecteds = this.projects
      .filter(sp => sp.checked)
      .map(sp => sp.project);

    this.projectFilter.next(selecteds);
  }

}
