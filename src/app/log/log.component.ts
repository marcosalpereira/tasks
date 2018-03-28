import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Event } from '../event.model';
import { Subscription } from 'rxjs/Subscription';
import { Task } from '../task.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  eventAddedSub: Subscription;
  events: Event[];

  constructor(
    private dataService: DataService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.events = this.dataService.getEvents();

    this.eventAddedSub = this.dataService.eventsChanged$.subscribe(
      events => this.events = events
    );
  }

  ngOnDestroy() {
    this.eventAddedSub.unsubscribe();
  }

  restartTask(task: Task) {
    this.dataService.startTask(task, '');
  }
  stopTask(task: Task) {
    this.dataService.stopTask(task);
  }

  editEvent(event: Event) {
    this.router.navigate(['event', event.id]);
  }

  canStopTask(event: Event) {
    return !event.endDate
      && new Date(event.startDate).getDate() === new Date().getDate();
  }
}
