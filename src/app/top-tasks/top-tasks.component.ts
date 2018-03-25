import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';
import { TaskCount, Task } from '../task.model';

@Component({
  selector: 'app-top-tasks',
  templateUrl: './top-tasks.component.html',
  styleUrls: ['./top-tasks.component.css']
})
export class TopTasksComponent implements OnInit, OnDestroy {

  taskStatsdSub: Subscription;
  topTasks: TaskCount[];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.topTasks = this.dataService.getTopTasks();

    this.taskStatsdSub = this.dataService.tasksStatChanged$.subscribe(
      topTasks => this.topTasks = topTasks
    );
  }

  ngOnDestroy() {
    this.taskStatsdSub.unsubscribe();
  }

  onClick(task: Task) {
    this.dataService.startTask(task);
  }

}
