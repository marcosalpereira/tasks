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
  event: Event;
  nextPrevious: NextPreviousEvent;
  periodoInvalido: 'start' | 'end';

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

    this.nextPrevious = this.dataService.findNextPreviousEvent(this.event);
  }

  onSubmit() {
    if (this.event.endDate) {
      this.event.endDate.setDate(this.event.startDate.getDate());
      this.event.endDate.setMonth(this.event.startDate.getMonth());
      this.event.endDate.setFullYear(this.event.startDate.getFullYear());
    }

    this.periodoInvalido = undefined;

    if (this.nextPrevious.next) {
      if (this.event.endDate.getTime() > this.nextPrevious.next.startDate.getTime()) {
        this.periodoInvalido = 'end';
      }
    }

    if (this.nextPrevious.previous) {
      if (this.event.startDate.getTime() < this.nextPrevious.previous.endDate.getTime()) {
        this.periodoInvalido = 'start';
      }
    }

    if (this.event.endDate) {
      if (this.event.endDate.getTime() < this.event.startDate.getTime()) {
        this.periodoInvalido = 'end';
      }
    }

    if (this.periodoInvalido) {
      return;
    }
    this.dataService.updateEvent(this.event);
    this.goBack();
  }

}
