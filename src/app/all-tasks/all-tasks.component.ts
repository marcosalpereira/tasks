import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Task } from '../task.model';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.css']
})
export class AllTasksComponent implements OnInit {

  tasks: Task[];

  constructor(
    private dataService: DataService,
    public appComponent: AppComponent) {
  }

  ngOnInit() {
    this.tasks = this.dataService.getTasks();
    console.log ( this.tasks)
  }

  deleteTask(task) {
    this.dataService.deleteTask(task);
  }

  restartTask(task: Task) {
      this.dataService.startTask(task.project, task.code, task.name, '');
  }

}
