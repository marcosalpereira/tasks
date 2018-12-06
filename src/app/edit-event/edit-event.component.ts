import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { DataService } from '../data.service';
import { Event, NextPreviousEvent } from '../event.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Task } from '../task.model';

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
  tasks: Task[];

  constructor(
    private dataService: DataService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) { }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.tasks = this.dataService.getTasks();

    const param = this.activeRoute.snapshot.paramMap;
    const id = +param.get('id');
    this.event = this.dataService.findEvent(id);
    this.nextPrevious = this.dataService.findNextPreviousEvent(this.event);
  }

  saveAnyWay() {
    this.onSubmit(false);
  }

  onSubmit(doValidation = true) {
    if (this.event.endDate) {
      this.event.endDate.setDate(this.event.startDate.getDate());
      this.event.endDate.setMonth(this.event.startDate.getMonth());
      this.event.endDate.setFullYear(this.event.startDate.getFullYear());
    }

    this.periodoInvalido = undefined;

    if (!doValidation) {
      console.log('no-validation-active');
    } else {
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
    }

    if (this.periodoInvalido) {
      return;
    }
    this.dataService.updateEvent(this.event);
    this.goBack();
  }

  compareTaskFn = (t1: Task, t2: Task): boolean => {
    return t1 && t2 && t1.id === t2.id;
  }

}
