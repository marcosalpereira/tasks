import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { Task } from '../task.model';
import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';
import { Config } from '../config.model';

@Component({
  selector: 'app-top-tasks',
  templateUrl: './top-tasks.component.html',
  styleUrls: ['./top-tasks.component.css']
})
export class TopTasksComponent implements OnInit, OnDestroy {

  topTaskSub: Subscription;
  topTasks: Task[];
  maxTopTasks: number;

  configChangedSub: Subscription;
  constructor(
    private dataService: DataService,
    private appComponent: AppComponent,
    private configService: ConfigService) {
  }

  ngOnInit() {
    this.maxTopTasks = this.configService.getConfig().maxTopTasks;
    this.configChangedSub = this.configService.configChanged$.subscribe(
      (config: Config) => {
        this.maxTopTasks = config.maxTopTasks;
    });

    this.topTasks = this.dataService.getTopTasks();

    this.topTaskSub = this.dataService.topTasksChanged$.subscribe(
      topTasks => this.topTasks = topTasks
    );
  }

  ngOnDestroy() {
    this.topTaskSub.unsubscribe();
    this.configChangedSub.unsubscribe();
  }

  onClick(task: Task) {
    this.dataService.startTask(task.project, task.code, task.name, '');
    this.appComponent.meny.close();
  }
}
