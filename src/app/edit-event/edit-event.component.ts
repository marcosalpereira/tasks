import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
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

    // this.startMoment = moment(this.event.startDate);
    // this.startTime = this.startMoment.format(TIME_FORMAT);

    // if (this.event.endDate) {
    //   this.endMoment = moment(this.event.endDate);
    //   this.endTime = this.endMoment.format(TIME_FORMAT);
    // }

    const previousNext = this.dataService.findPreviousAndNextEvent(this.event.id);
    console.log(previousNext);
    if (previousNext.previous) {
      this.minTimeStart = moment(previousNext.previous.endDate).toDate();
    }
    console.log(this.minTimeStart, this.maxTimeEnd);

    if (previousNext.next) {
      this.maxTimeEnd = moment(previousNext.next.startDate).toDate();
    }
    

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


    this.dataService.updateEvent(this.event);
    this.goBack();
  }

  private setTime(m: moment.Moment, novo: moment.Moment): void {
    m.hour(novo.hour());
    m.minute(novo.minute());
    m.second(novo.second());
  }

}
