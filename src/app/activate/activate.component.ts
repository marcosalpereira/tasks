import { Component, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { Project } from '../project.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  projects: Project[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.projects = this.dataService.getProjects();
  }

  onSubmit(form: NgForm) {
    const project: Project = form.value['project'];
    const taskName: string = form.value['taskName'];
    const task:Task = new Task(project, taskName);
    this.dataService.addEvent(task);
  }

}
