import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Event } from '../event.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

  @Input() event: Event;
  @Output() eventChange = new EventEmitter<Event>();

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
    this.startDate = this.event.startDate.toISOString().slice(0,16);
    this.endDate = this.event.endDate;
    this.startTime = this.event.startDate;
    this.endTime = this.event.endDate;

  }

  onSubmit() {
    this.dataService.updateEvent(this.event);
  }

}
