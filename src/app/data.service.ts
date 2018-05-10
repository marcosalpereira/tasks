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
    this.eventsChanged$.next(this.getEvents());
    this.projectsChanged$.next(this.getProjects());
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
        let taskSummary = summary.taskSummaryMap[event.task.id];
        if (!taskSummary) {
          taskSummary = new TaskSummary(event.task);
          summary.taskSummaryMap[event.task.id] = taskSummary;
        }
        const minutes = DateUtil.durationMinutes(startMoment, moment(event.endDate));
        if (event.registered) {
          taskSummary.minutesRegistered[startMoment.weekday()] += minutes;
        } else {
          taskSummary.minutesPending[startMoment.weekday()] += minutes;
        }
        taskSummary.events.push(event);
      }

      return map;
    }, new Map());

    console.log('map', tmpMap);

    const items = Object.keys(tmpMap).map(key => tmpMap[key]);
    items.sort((left: Summary, right: Summary) =>
      right.startDate.getTime() - left.startDate.getTime()
    );

    console.log('items', items);

    return items;
  }

  getConfig(): Config {
    return new Config('/home/54706424372/Documentos/apropriacao',
      '54706424372', 'firefox', 'selenium',
      '/home/54706424372/bin/firefox-dev/firefox');
  }


}
