import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Event } from '../event.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;

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

    const start = moment(this.event.startDate);
    this.startDate = start.format('DD/MM/YYYY HH:mm:ss');

    const end = moment(this.event.endDate);
    this.endDate = end.format('DD/MM/YYYY  HH:mm:ss');
  }
  onSubmit() {
    this.dataService.updateEvent(this.event);
    this.goBack();
  }

}
