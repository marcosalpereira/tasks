import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
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

  @ViewChild('endTimeEl') endTimeEl: NgModel;
  @ViewChild('form') form: NgForm;

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
      this.minTimeStart = undefined;
    }

    if (this.nextPrevious.next) {
      this.maxTimeEnd = this.nextPrevious.next.startDate;
    } else {
      this.maxTimeEnd = undefined;
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
    const msd = moment(this.event.startDate)
      .hour(m.hour())
      .minute(m.minute());
    this.event.startDate = msd.toDate();
    if (this.event.endDate) {
      this.event.endDate = this.updateDate(this.event.endDate);
    }
  }

  onInputEndTime() {
    const m = moment(this.endTime, 'HH:mm');
    const med = moment(this.event.endDate)
      .hour(m.hour())
      .minute(m.minute());
    this.event.endDate = med.toDate();
    if (this.event.endDate) {
      this.event.endDate = this.updateDate(this.event.endDate);
    }
  }

  onInputStartDate() {
    const newDate = this.updateDate(this.event.startDate);
    if (newDate.getDate() !== this.event.startDate.getDate()) {
      this.minTimeStart = undefined;
      this.maxTimeEnd = undefined;
    }
    this.event.startDate = newDate;
    if (this.event.endDate) {
      this.event.endDate = this.updateDate(this.event.endDate);
    }
  }

  private updateDate(target: Date): Date {
    const base = moment(this.startDate, 'DD/MM/YY');
    const msd = moment(target)
      .year(base.year())
      .month(base.month())
      .date(base.date());
    return msd.toDate();
  }


}
