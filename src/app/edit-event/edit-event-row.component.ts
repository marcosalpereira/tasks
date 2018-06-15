import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { DataService } from '../data.service';
import { Event, NextPreviousEvent } from '../event.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-event-row',
  templateUrl: './edit-event-row.component.html'
})
export class EditEventRowComponent implements OnInit, AfterViewInit {
  @Input()
  form: NgForm;

  @Input()
  event: Event;

  @Input()
  label: string;

  @Input()
  required: boolean;

  @Input()
  disabled: boolean;

  @Input()
  minTimeStart: Date;

  @Input()
  maxTimeEnd: Date;

  date: Date;

  @ViewChild('startTimeEl') startTimeEl: NgModel;
  @ViewChild('endTimeEl') endTimeEl: NgModel;
  valid: boolean;

  ngOnInit() {
    if (this.event) {
      this.date = this.event.startDate;
    }
  }

  ngAfterViewInit() {
    if (this.form) {
      this.form.addControl(this.startTimeEl);
      this.form.addControl(this.endTimeEl);
    }
  }

  isValid(event: boolean): void {
    this.valid = event;
  }  
}
