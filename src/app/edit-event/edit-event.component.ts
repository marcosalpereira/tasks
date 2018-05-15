import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService, PreviousNextEvent } from '../data.service';
import { Event } from '../event.model';
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
  previousNext: PreviousNextEvent;
  maxTimeEnd: Date;
  minTimeStart: Date;
  startMoment: moment.Moment;
  endMoment: moment.Moment;

  event: Event;

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

    // this.startMoment = moment(this.event.startDate);
    // this.startTime = this.startMoment.format(TIME_FORMAT);

    // if (this.event.endDate) {
    //   this.endMoment = moment(this.event.endDate);
    //   this.endTime = this.endMoment.format(TIME_FORMAT);
    // }
    const now = moment();

    this.previousNext = this.dataService.findPreviousAndNextEvent(this.event.id);
    if (this.previousNext.previous) {
      this.minTimeStart = moment(this.previousNext.previous.endDate).toDate();
      } else {
          this.minTimeStart = now.subtract(1, 'months').toDate();
      }
      console.log('start', this.minTimeStart);

    if (this.previousNext.next) {
      this.maxTimeEnd = moment(this.previousNext.next.startDate).toDate();
    } else {
      this.minTimeStart = new Date();
    }
    console.log('end', this.maxTimeEnd);


  }

  onSubmit() {
    // let startMoment = moment(this.startTime, TIME_FORMAT);
    // let endMoment = this.endTime ? moment(this.endTime, TIME_FORMAT) : undefined;

    // if (endMoment) {
    //   if (endMoment.isBefore(startMoment)) {
    //     const tmp = startMoment;
    //     startMoment = endMoment;
    //     endMoment = tmp;
    //   }

    //   if (!this.endMoment) {
    //     this.endMoment = this.startMoment.clone();
    //   }
    //   this.setTime(this.endMoment, endMoment);
    //   this.event.endDate = this.endMoment.toDate();

    // } else {
    //   this.event.endDate = undefined;
    // }

    // this.setTime(this.startMoment, startMoment);
    // this.event.startDate = this.startMoment.toDate();

    if (this.event.endDate
      && this.event.endDate.getHours() === 0
      && this.event.endDate.getMinutes() === 0
      && this.event.endDate.getSeconds() === 0) {
        this.event.endDate = undefined;
    }

    this.dataService.updateEvent(this.event);
    this.goBack();
  }

  // private setTime(m: moment.Moment, novo: moment.Moment): void {
  //   m.hour(novo.hour());
  //   m.minute(novo.minute());
  //   m.second(novo.second());
  // }

}
