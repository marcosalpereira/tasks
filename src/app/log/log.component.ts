import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Event } from '../event.model';
import { Subscription } from 'rxjs/Subscription';
import { Task } from '../task.model';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserService } from '../browser.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  eventsChanged$: Subscription;
  events: Event[];

  constructor(
    private dataService: DataService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.events = this.dataService.getEvents();

    this.eventsChanged$ = this.dataService.eventsChanged$.subscribe(
      events => this.events = events
    );
  }

  ngOnDestroy() {
    this.eventsChanged$.unsubscribe();
  }

  restartTask(event: Event) {
    const task = event.task;
    this.dataService.startTask(task.project, task.code, task.name, event.remarks);
  }
  stopTask(event: Event) {
    this.dataService.stopTask(event);
  }

  editEvent(event: Event) {
    this.router.navigate(['event', event.id]);
  }

  deleteEvent(event: Event) {
    this.dataService.deleteEvent(event);
  }

  canStopTask(event: Event) {
    return !event.endDate
      && new Date(event.startDate).getDate() === new Date().getDate();
  }


}
