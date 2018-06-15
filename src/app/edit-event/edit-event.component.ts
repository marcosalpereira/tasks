import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Event, NextPreviousEvent } from '../event.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

const TIME_FORMAT = 'HH:mm:ss';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  maxTimeEnd: Date;
  minTimeStart: Date;
  startMoment: moment.Moment;
  endMoment: moment.Moment;

  event: Event;
  nextPrevious: NextPreviousEvent;

  constructor(
    private dataService: DataService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) { }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    const param = this.activeRoute.snapshot.paramMap;
    const id = +param.get('id');
    this.event = this.dataService.findEvent(id);

    if (!this.event.endDate) {
      this.event.endDate = moment(this.event.startDate).startOf('day').toDate();
    }

    const now = moment();

    this.nextPrevious = this.dataService.findNextPreviousEvent(this.event);
    console.log(this.nextPrevious);

    if (this.nextPrevious.previous) {
      this.minTimeStart = this.nextPrevious.previous.endDate;
    } else {
      this.minTimeStart = now.subtract(1, 'months').toDate();
    }

    if (this.nextPrevious.next) {
      this.maxTimeEnd = this.nextPrevious.next.startDate;
    } else {
      this.minTimeStart = new Date();
    }
  }

  onSubmit() {

    if (this.event.endDate
      && this.event.endDate.getHours() === 0
      && this.event.endDate.getMinutes() === 0
      && this.event.endDate.getSeconds() === 0) {
      this.event.endDate = undefined;
    }

    this.dataService.updateEvent(this.event);
    this.goBack();
  }

}
