import { Injectable, OnInit } from '@angular/core';
import { Project } from './project.model';
import { Task, TaskCount } from './task.model';
import { Event } from './event.model';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import {Summary, TaskSummary} from './summary.model';

import { WeekRange, DateUtil } from './date-util';
import { Config } from './config.model';

export interface PreviousNextEvent { previous?: Event; next?: Event; }

@Injectable()
export class DataService {
  public eventsChanged$ = new Subject<Event[]>();
  public projectsChanged$ = new Subject<Project[]>();
  public tasksStatChanged$ = new Subject<TaskCount[]>();

  private topTasks: TaskCount[] = [];

  private events: Event[];

  constructor() {
    // this.tmp();
  }

  // tmp() {    
  //   localStorage.clear();
  //   localStorage.setItem('ev-10-3-2018', '[{"id":1523378400000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-10T16:40:00.000Z","registered":true,"remarks":"","endDate":"2018-04-10T20:19:00.000Z"},{"id":1523356380000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-10T10:33:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-10T14:56:00.000Z"}]');	
  //   localStorage.setItem('ev-10-4-2018', '[{"id":1525970552245,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-10T16:42:32.245Z","registered":false,"remarks":"","endDate":"2018-05-10T19:28:11.522Z"},{"id":1525970535168,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-10T16:42:15.168Z","registered":false,"remarks":"","endDate":"2018-05-10T16:42:32.245Z"},{"id":1525951934623,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-10T11:32:14.623Z","registered":false,"remarks":"","endDate":"2018-05-10T15:01:00.227Z"},{"id":1525947843094,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-10T10:24:03.094Z","registered":false,"remarks":"","endDate":"2018-05-10T11:29:07.619Z"}]');	
  //   localStorage.setItem('ev-11-3-2018', '[{"id":1523464740000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-11T16:39:00.000Z","registered":true,"remarks":"","endDate":"2018-04-11T21:06:00.000Z"},{"id":1523443500000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-11T10:45:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-11T14:58:00.000Z"}]');	
  //   localStorage.setItem('ev-11-4-2018', '[{"id":1526039426644,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-11T10:29:00.644Z","registered":false,"remarks":""}]');	
  //   localStorage.setItem('ev-12-3-2018', '[{"id":1523551080000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-12T16:38:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-12T20:30:00.000Z"},{"id":1523529300000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-12T10:35:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-12T14:56:00.000Z"}]');	
  //   localStorage.setItem('ev-13-3-2018', '[{"id":1523639100000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-13T17:05:00.000Z","registered":true,"remarks":"","endDate":"2018-04-13T20:28:00.000Z"},{"id":1523615460000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-13T10:31:00.000Z","registered":true,"remarks":"","endDate":"2018-04-13T14:55:00.000Z"}]');	
  //   localStorage.setItem('ev-16-3-2018', '[{"id":1523897160000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-16T16:46:00.000Z","registered":true,"remarks":"","endDate":"2018-04-16T20:01:00.000Z"},{"id":1523875200000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-16T10:40:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-16T15:03:00.000Z"}]');	
  //   localStorage.setItem('ev-17-3-2018', '[{"id":1523984280000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-17T16:58:00.000Z","registered":true,"remarks":"","endDate":"2018-04-17T18:39:00.000Z"},{"id":1523961300000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-17T10:35:00.000Z","registered":true,"remarks":"","endDate":"2018-04-17T15:03:00.000Z"}]');	
  //   localStorage.setItem('ev-18-3-2018', '[{"id":1524020400000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-18T03:00:00.000Z","registered":true,"remarks":"\"assinador","endDate":"2018-04-18T17:02:00.000Z"},{"id":1524069600000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-18T16:40:00.000Z","registered":true,"remarks":"","endDate":"2018-04-18T17:02:00.000Z"},{"id":1524047760000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-18T10:36:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-18T14:59:00.000Z"}]');	
  //   localStorage.setItem('ev-19-3-2018', '[{"id":1524106800000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-19T03:00:00.000Z","registered":true,"remarks":"\"assinador","endDate":"2018-04-19T16:54:00.000Z"},{"id":1524133980000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-19T10:33:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-19T14:54:00.000Z"}]');	
  //   localStorage.setItem('ev-2-3-2018', '[{"id":1522688400000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-02T17:00:00.000Z","registered":true,"remarks":"","endDate":"2018-04-02T20:35:00.000Z"}]');	
  //   localStorage.setItem('ev-2-4-2018', '[{"id":1525279320000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-02T16:42:00.000Z","registered":true,"remarks":"","endDate":"2018-05-02T20:43:00.000Z"},{"id":1525264200000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-02T12:30:00.000Z","registered":true,"remarks":"","endDate":"2018-05-02T14:55:00.000Z"},{"id":1525262400000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-02T12:00:00.000Z","registered":true,"remarks":"gateway","endDate":"2018-05-02T12:30:00.000Z"},{"id":1525260780000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459008,"name":"Participar Treinamento"},"startDate":"2018-05-02T11:33:00.000Z","registered":true,"remarks":"apm","endDate":"2018-05-02T12:00:00.000Z"},{"id":1525258140000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-02T10:49:00.000Z","registered":true,"remarks":"","endDate":"2018-05-02T11:33:00.000Z"}]');	
  //   localStorage.setItem('ev-20-3-2018', '[{"id":1524243480000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-20T16:58:00.000Z","registered":true,"remarks":"","endDate":"2018-04-20T20:31:00.000Z"},{"id":1524221580000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-20T10:53:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-20T14:55:00.000Z"}]');	
  //   localStorage.setItem('ev-21-1-2018', '[{"id":1519230900000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-02-21T16:35:00.000Z","registered":false,"remarks":"","endDate":"2018-02-21T20:51:00.000Z"},{"id":1519209540000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459008,"name":"Participar Treinamento"},"startDate":"2018-02-21T10:39:00.000Z","registered":false,"remarks":"","endDate":"2018-02-21T14:50:00.000Z"}]');	
  //   localStorage.setItem('ev-22-1-2018', '[{"id":1519296300000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-02-22T10:45:00.000Z","registered":false,"remarks":"angular t3","endDate":"2018-02-22T14:57:00.000Z"}]');	
  //   localStorage.setItem('ev-23-3-2018', '[{"id":1524502200000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-23T16:50:00.000Z","registered":true,"remarks":"","endDate":"2018-04-23T20:05:00.000Z"},{"id":1524479280000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-23T10:28:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-23T14:59:00.000Z"}]');	
  //   localStorage.setItem('ev-24-3-2018', '[{"id":1524589200000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-24T17:00:00.000Z","registered":true,"remarks":"","endDate":"2018-04-24T20:04:00.000Z"},{"id":1524566040000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-24T10:34:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-24T15:00:00.000Z"}]');	
  //   localStorage.setItem('ev-25-3-2018', '[{"id":1524675900000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-25T17:05:00.000Z","registered":true,"remarks":"","endDate":"2018-04-25T20:33:00.000Z"},{"id":1524653400000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-25T10:50:00.000Z","registered":true,"remarks":"","endDate":"2018-04-25T15:00:00.000Z"}]');	
  //   localStorage.setItem('ev-26-3-2018', '[{"id":1524762720000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-26T17:12:00.000Z","registered":true,"remarks":"","endDate":"2018-04-26T21:33:00.000Z"},{"id":1524738540000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-26T10:29:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-26T15:00:00.000Z"}]');	
  //   localStorage.setItem('ev-27-3-2018', '[{"id":1524848220000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-27T16:57:00.000Z","registered":true,"remarks":"","endDate":"2018-04-27T20:34:00.000Z"},{"id":1524826200000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-27T10:50:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-27T15:02:00.000Z"}]');	
  //   localStorage.setItem('ev-3-3-2018', '[{"id":1522773360000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-03T16:36:00.000Z","registered":true,"remarks":"","endDate":"2018-04-03T20:49:00.000Z"},{"id":1522752600000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-03T10:50:00.000Z","registered":true,"remarks":"","endDate":"2018-04-03T14:55:00.000Z"}]');	
  //   localStorage.setItem('ev-3-4-2018', '[{"id":1525368600000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-03T17:30:00.000Z","registered":false,"remarks":"Dojo – ancora","endDate":"2018-05-03T20:15:00.000Z"},{"id":1525365600000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-03T16:40:00.000Z","registered":false,"remarks":"","endDate":"2018-05-03T17:30:00.000Z"},{"id":1525351860000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-03T12:51:00.000Z","registered":false,"remarks":"","endDate":"2018-05-03T15:03:00.000Z"},{"id":1525344480000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459008,"name":"Participar Treinamento"},"startDate":"2018-05-03T10:48:00.000Z","registered":false,"remarks":"apm","endDate":"2018-05-03T12:51:00.000Z"}]');	
  //   localStorage.setItem('ev-30-3-2018', '[{"id":1525107060000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-30T16:51:00.000Z","registered":true,"remarks":"","endDate":"2018-04-30T19:20:00.000Z"},{"id":1525084200000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-30T10:30:00.000Z","registered":true,"remarks":"","endDate":"2018-04-30T15:00:00.000Z"}]');	
  //   localStorage.setItem('ev-4-3-2018', '[{"id":1522861680000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-04T17:08:00.000Z","registered":true,"remarks":"","endDate":"2018-04-04T20:15:00.000Z"},{"id":1522837200000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-04T10:20:00.000Z","registered":true,"remarks":"","endDate":"2018-04-04T15:01:00.000Z"}]');	
  //   localStorage.setItem('ev-4-4-2018', '[{"id":1525451460000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-04T16:31:00.000Z","registered":false,"remarks":"","endDate":"2018-05-04T20:26:00.000Z"},{"id":1525430160000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-04T10:36:00.000Z","registered":false,"remarks":"","endDate":"2018-05-04T15:01:00.000Z"}]');	
  //   localStorage.setItem('ev-5-3-2018', '[{"id":1522946340000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-05T16:39:00.000Z","registered":true,"remarks":"","endDate":"2018-04-05T20:41:00.000Z"},{"id":1522926660000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-05T11:11:00.000Z","registered":true,"remarks":"","endDate":"2018-04-05T15:01:00.000Z"}]');	
  //   localStorage.setItem('ev-6-3-2018', '[{"id":1523033700000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-06T16:55:00.000Z","registered":true,"remarks":"","endDate":"2018-04-06T21:05:00.000Z"},{"id":1523010780000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-06T10:33:00.000Z","registered":true,"remarks":"","endDate":"2018-04-06T15:01:00.000Z"}]');	
  //   localStorage.setItem('ev-7-4-2018', '[{"id":1525710530257,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-07T16:28:50.257Z","registered":false,"remarks":"","endDate":"2018-05-07T20:14:56.271Z"},{"id":1525696034928,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-07T12:27:14.928Z","registered":false,"remarks":"","endDate":"2018-05-07T15:03:39.736Z"},{"id":1525690433434,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459008,"name":"Participar Treinamento"},"startDate":"2018-05-07T10:53:53.434Z","registered":false,"remarks":"apm","endDate":"2018-05-07T12:26:27.830Z"},{"id":1525689180000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-07T10:33:00.000Z","registered":false,"remarks":"","endDate":"2018-05-07T10:53:53.434Z"}]');	
  //   localStorage.setItem('ev-8-4-2018', '[{"id":1525811750515,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-08T16:55:00.515Z","registered":false,"remarks":"","endDate":"2018-05-08T20:35:00.374Z"},{"id":1525811682148,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-08T10:53:00.148Z","registered":false,"remarks":"","endDate":"2018-05-08T15:00:00.417Z"},{"id":1525776834888,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459008,"name":"Participar Treinamento"},"startDate":"2018-05-08T10:53:54.888Z","registered":false,"remarks":"","endDate":"2018-05-08T12:00:00.719Z"}]');	
  //   localStorage.setItem('ev-9-3-2018', '[{"id":1523292480000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-04-09T16:48:00.000Z","registered":true,"remarks":"","endDate":"2018-04-09T20:25:00.000Z"},{"id":1523270460000,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459010,"name":"Ministrar Treinamento 2018"},"startDate":"2018-04-09T10:41:00.000Z","registered":true,"remarks":"angular t4","endDate":"2018-04-09T14:55:00.000Z"}]');	
  //   localStorage.setItem('ev-9-4-2018', '[{"id":1525883901642,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-09T16:38:21.642Z","registered":false,"remarks":"","endDate":"2018-05-09T20:30:25.269Z"},{"id":1525861942805,"task":{"project":{"name":"DEDAT - Departamento de Arquitetura"},"id":1459020,"name":"Gerir Unidade 2018"},"startDate":"2018-05-09T10:32:22.805Z","registered":false,"remarks":"","endDate":"2018-05-09T15:01:29.455Z"}]');	
  //   localStorage.setItem('projects', '[{"name":"DEDAT - Departamento de Arquitetura"}]');
  // }

  markEventAsRegistered(eventId: number): void {
    const date = new Date(eventId);
    const key = this.getDayEventKey(date);
    const events: Event[] = JSON.parse(localStorage.getItem(key));
    const index = events.findIndex(e => e.id === eventId);
    events[index].registered = true;
    localStorage.setItem(key, JSON.stringify(events));
  }

  getTopTasks() {
    if (this.topTasks.length === 0) {
      this.getEvents();
    }
    return this.topTasks;
  }

  findPreviousAndNextEvent(id: number): PreviousNextEvent {
    const date = new Date(id);
    const key = this.getDayEventKey(date);
    const events: Event[] = JSON.parse(localStorage.getItem(key)) || [];
    const index = events.findIndex(e => e.id === id);
    const ret: PreviousNextEvent = {};
    if (index > 0) { ret.next = events[index - 1]; }
    if (index < events.length - 1) { ret.previous = events[index + 1]; }
    return ret;
  }

  stopTask(task: Task) {
      const date = new Date();
      const key = this.getDayEventKey(date);
      const events: Event[] = JSON.parse(localStorage.getItem(key)) || [];
      events[0].endDate = date;
      localStorage.setItem(key, JSON.stringify(events));
      this.eventsChanged$.next(this.getEvents());
  }

  findEvent(id: number): Event {
    const date = new Date(id);
    const key = this.getDayEventKey(date);
    const events: Event[] = JSON.parse(localStorage.getItem(key)) || [];
    const event = events.find(e => e.id === id);
    return event;
  }

  updateEvent(event: Event) {
    const date = new Date(event.id);
    const key = this.getDayEventKey(date);
    const events: Event[] = JSON.parse(localStorage.getItem(key)) || [];
    const index = events.findIndex(e => e.id === event.id);
    events[index] = event;
    localStorage.setItem(key, JSON.stringify(events));
    this.eventsChanged$.next(this.getEvents());
  }

  deleteEvent(event: Event) {
    const date = new Date(event.id);
    const key = this.getDayEventKey(date);
    let events: Event[] = JSON.parse(localStorage.getItem(key)) || [];
    events = events.filter(e => e.id !== event.id);
    localStorage.setItem(key, JSON.stringify(events));
    this.eventsChanged$.next(this.getEvents());
  }


  bulkImportAddEvent(task: Task, startDate: Date, endDate: Date, registered: boolean, remarks: string) {
    const id = startDate.getTime();
    const event: Event = new Event(id, task, startDate);
    event.registered = registered;
    event.remarks = remarks;
    event.endDate = endDate;
    const key = this.getDayEventKey(startDate);
    const events: Event[] = JSON.parse(localStorage.getItem(key)) || [];
    events.unshift(event);
    console.log(event);
    localStorage.setItem(key, JSON.stringify(events));
  }

  startTask(task: Task, remarks: string): void {
    const date = new Date();
    const key = this.getDayEventKey(date);
    const events: Event[] = JSON.parse(localStorage.getItem(key)) || [];

    // finalizar anterior
    if (events.length > 0) {
      if (!events[0].endDate) {
        events[0].endDate = date;
      }
    }

    const id = date.getTime();

    const event = new Event(id, task, date);
    event.remarks = remarks;

    events.unshift(event);
    localStorage.setItem(key, JSON.stringify(events));

    this.eventsChanged$.next(this.getEvents());
    // this.updateTaskStats(task);
  }

  // update_TaskStats(task: Task) {
  //   const index = this.topTasks.findIndex((value: TaskCount) =>
  //     value.task.name === task.name && value.task.project.name === task.project.name
  //   );
  //   if (index === -1) {
  //     if (this.topTasks.length < 7) {
  //       this.topTasks.push(new TaskCount(task, 1));
  //       this.tasksStatChanged$.next(this.topTasks);
  //     }
  //   } else {
  //     this.topTasks[index].count++;
  //     this.tasksStatChanged$.next(this.topTasks);
  //   }
  // }

  getEvents(): Event[] {
    const events: Event[] = [];
    const m = moment();
    for (let i = 0; i < 20; i++) {
      const dayEvents = this.getDayEvents(m.toDate());
      events.push(...dayEvents);
      m.subtract(1, 'day');
    }
    this.updateTasksStats(events);
    return events;
  }

  updateTasksStats(events: Event[]): void {

    const freq = events.reduce(function (map, event: Event) {
      const key = JSON.stringify(event.task);
      map[key] ? map[key]++ : map[key] = 1;
      return map;
    }, new Map());

    const items = Object.keys(freq).map(function (key) {
      return new TaskCount(JSON.parse(key), freq[key]);
    });

    items.sort((left: TaskCount, right: TaskCount) =>
      right.count - left.count
    );

    this.topTasks = items.slice(0, 7);

    this.tasksStatChanged$.next(this.topTasks);
  }

  getDayEventKey(date: Date): string {
    return `ev-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  }

  getDayEvents(date: Date): Event[] {
    const key = this.getDayEventKey(date);
    const events = JSON.parse(localStorage.getItem(key)) || [];
    return events;
  }

  addProject(project: Project): void {
    const projects: Project[] = this.getProjects();
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));

    this.projectsChanged$.next(projects);
  }

  bulkImportBegin() {
    localStorage.clear();
  }

  bulkImportEnd() {
    this.fireEventsChanged();
    this.projectsChanged$.next(this.getProjects());
  }

  fireEventsChanged() {
    this.eventsChanged$.next(this.getEvents());
  }

  getProjects(): Project[] {
    const s = localStorage.getItem('projects') || '[]';
    return JSON.parse(s);
  }

  getSummary(): Summary[] {
    const events = this.getEvents();

    const tmpMap = events.reduce(function (map, event: Event) {
      const startMoment = moment(event.startDate);
      const key = startMoment.week();
      let summary: Summary = map[key];
      if (!summary) {
        const weekRange = DateUtil.weekRange(event.startDate);
        summary = new Summary(weekRange.startDate, weekRange.endDate);
        map[key] = summary;
      }

      if (event.endDate) {
        let taskSummaryMap = summary.taskSummaryMap[event.task.id];
        if (!taskSummaryMap) {
          taskSummaryMap = new TaskSummary(event.task);
          summary.taskSummaryMap[event.task.id] = taskSummaryMap;
        }
        const minutes = DateUtil.durationMinutes(startMoment, moment(event.endDate));
        if (event.registered) {
          if (!taskSummaryMap.minutesRegistered) {
            taskSummaryMap.minutesRegistered = [0, 0, 0, 0, 0, 0, 0, 0];
          }
          taskSummaryMap.minutesRegistered[startMoment.weekday()] += minutes;
        } else {
          if (!taskSummaryMap.minutesPending) {
            taskSummaryMap.minutesPending = [0, 0, 0, 0, 0, 0, 0, 0];
          }
          taskSummaryMap.minutesPending[startMoment.weekday()] += minutes;
        }
        summary.minutesTotal[startMoment.weekday()] += minutes;
        taskSummaryMap.events.push(event);
      }

      return map;
    }, new Map());

    const items = Object.keys(tmpMap).map(key => tmpMap[key]);
    items.sort((left: Summary, right: Summary) =>
      right.startDate.getTime() - left.startDate.getTime()
    );

    return items;
  }

  getConfig(): Config {
    return new Config('/home/54706424372/Documentos/apropriacao',
      '54706424372', 'firefox', 'selenium',
      '/home/54706424372/bin/firefox-dev/firefox');
  }


}
