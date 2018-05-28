import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';
import { Task } from '../task.model';

@Component({
  selector: 'app-top-tasks',
  templateUrl: './top-tasks.component.html',
  styleUrls: ['./top-tasks.component.css']
})
export class TopTasksComponent implements OnInit, OnDestroy {

  topTaskSub: Subscription;
  topTasks: Task[];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.topTasks = this.dataService.getTopTasks();

    this.topTaskSub = this.dataService.topTasksChanged$.subscribe(
      topTasks => this.topTasks = topTasks
    );
  }

  ngOnDestroy() {
    this.topTaskSub.unsubscribe();
  }

  onClick(task: Task) {
    this.dataService.startTask(task.project, task.code, task.name, '');
  }

}
