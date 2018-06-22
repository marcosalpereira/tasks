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

  startDate: string;
  startTime: string;
  endTime: string;

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

    const now = moment();

    this.nextPrevious = this.dataService.findNextPreviousEvent(this.event);
    
    if (this.nextPrevious.previous) {
      this.minTimeStart = this.nextPrevious.previous.endDate;
    } else {
      this.minTimeStart = now.startOf('day').toDate();
    }

    if (this.nextPrevious.next) {
      this.maxTimeEnd = this.nextPrevious.next.startDate;
    } else {
      this.maxTimeEnd = now.endOf('day').toDate();
    }

    const startMoment = moment(this.event.startDate);
    this.startDate = startMoment.format('DD/MM/YY');

    this.startTime = startMoment.format('HH:mm');
    if (this.event.endDate) {
      const endMoment = moment(this.event.endDate);
      this.endTime = endMoment.format('HH:mm');
    }

  }

  onSubmit() {
    if (!this.endTime) {
      this.event.endDate = undefined;
    }
    this.dataService.updateEvent(this.event);
    this.goBack();
  }

  onInputStartTime() {
    const m = moment(this.startTime, 'HH:mm');
    const msd = moment(this.event.startDate);
    msd.hour(m.hour());
    msd.minute(m.minute());
    this.event.startDate = msd.toDate();
  }

  onInputEndTime() {
    const m = moment(this.endTime, 'HH:mm');
    const med = moment(this.event.endDate);
    med.hour(m.hour());
    med.minute(m.minute());
    this.event.endDate = med.toDate();
  }

  onInputStartDate() {
    const m = moment(this.startDate, 'DD/MM/YY');

    const msd = moment(this.event.startDate);
    msd.month(m.month());
    msd.year(m.year());
    msd.day(m.day());
    this.event.startDate = msd.toDate();

  }


}
