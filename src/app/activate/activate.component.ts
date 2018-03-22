import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { Project } from '../project.model';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit, OnDestroy {

  projectAddedSub: Subscription;
  projects: Project[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.projects = this.dataService.getProjects();

    this.projectAddedSub = this.dataService.projectAdded$.subscribe(
      project => {
        this.projects.push(project);
        this.projects = this.projects.slice();
      }
    );
  }

  ngOnDestroy() {
    this.projectAddedSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const project: Project = form.value['project'];
    const taskName: string = form.value['taskName'];
    const taskId: number = +form.value['taskId'];
    const task: Task = new Task(project, taskId, taskName);
    this.dataService.addEvent(task);
  }

}
