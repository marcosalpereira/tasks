import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Event } from '../event.model';
import { Task } from '../task.model';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserService } from '../browser.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  eventsChanged$: Subscription;
  events: Event[];

  assignedsColors = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.updateData(this.dataService.getEvents());

    this.eventsChanged$ = this.dataService.eventsChanged$.subscribe(
      events => this.updateData(events)
    );
  }

  updateData(events) {
    this.events = events;
    this.assignColors();
  }

  assignColors() {
    if (!this.events) { return; }
    let colorIndex = 0;
    this.events.forEach(e => {
      const assigned = this.assignedsColors.find(t => e.task.id === t.id);
      if (assigned) {
        e.task.colorIndex = assigned.colorIndex;
      } else {
        e.task.colorIndex = colorIndex;
        colorIndex = colorIndex % 9 + 1;
        this.assignedsColors.push(e.task);
      }
    });
  }

  ngOnDestroy() {
    this.eventsChanged$.unsubscribe();
  }

  restartTask(event: Event, sameDay: boolean) {
    const task = event.task;
    if (sameDay) {
      event.startDate = new Date(event.startDate);
      const date = new Date();
      date.setDate(event.startDate.getDate());
      date.setMonth(event.startDate.getMonth());
      date.setFullYear(event.startDate.getFullYear());
      this.dataService.startTask(task.project, task.code, task.name, event.remarks, date);
    } else {
      this.dataService.startTask(task.project, task.code, task.name, event.remarks);
    }
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

  isSameWeek(event: Event) {
    const eventWeek = moment(event.startDate).week();
    const currentWeek = moment().week();
    return eventWeek === currentWeek;
  }

  unregister(event: Event) {
    this.dataService.unregisterEvent(event);
  }


}
