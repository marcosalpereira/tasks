import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Event } from '../event.model';
import { Subscription } from 'rxjs/Subscription';
import { Task } from '../task.model';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  eventAddedSub: Subscription;
  events: Event[];
  constructor(private dataService: DataService) { }

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
    console.log(task);
    this.dataService.addEvent(task);
  }

}
