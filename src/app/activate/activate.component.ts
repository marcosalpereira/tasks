import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Task } from '../task.model';
import { Project } from '../project.model';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit, OnDestroy {

  projectAddedSub: Subscription;
  projects: Project[] = [];

  @ViewChild('form') form: NgForm;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.projects = this.dataService.getProjects();

    this.projectAddedSub = this.dataService.projectAdded$.subscribe(
      project => {
        this.projects.push(project);
        this.projects = this.projects.slice();
        const v = this.form.value;
        v['project'] = project;
        this.form.setValue(v);
      }
    );
  }

  ngOnDestroy() {
    this.projectAddedSub.unsubscribe();
  }

  onSubmit() {
    const project: Project = this.form.value['project'];
    const taskName: string = this.form.value['taskName'];
    const taskId: number = +this.form.value['taskId'];
    const task: Task = new Task(project, taskId, taskName);
    this.dataService.startTask(task);
  }

  onClickNewProject() {
    const newProject = window.prompt('New project Name');
    if (!newProject) {
      return;
    }
    this.dataService.addProject(new Project(newProject));
  }

}
