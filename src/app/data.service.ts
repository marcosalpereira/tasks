import { Injectable, OnInit } from '@angular/core';
import { Project } from './project.model';
import { Task, TaskCount } from './task.model';
import { Event } from './event.model';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DataService {

  public eventsChanged$ = new Subject<Event[]>();
  public projectAdded$ = new Subject<Project>();
  public tasksStatChanged$ = new Subject<TaskCount[]>();

  private topTasks: TaskCount[] = [];

  getTopTasks() {
    if (this.topTasks.length === 0) {
      this.getEvents();
    }
    return this.topTasks;
  }

  addEvent(task: Task): void {
    const date = new Date();
    const key = this.getDayEventKey(date);
    const events: Event[] = JSON.parse(localStorage.getItem(key)) || [];

    // finalizar anterior
    if (events.length > 0) {
      if (!events[0].endDate) {
        events[0].endDate = date;
      }
    }

    const event = new Event(task, date);

    events.unshift(event);
    localStorage.setItem(key, JSON.stringify(events));

    this.eventsChanged$.next(events);
    this.updateTaskStats(task);
  }

  updateTaskStats(task: Task) {
    const index = this.topTasks.findIndex((value: TaskCount) =>
      value.task.name === task.name && value.task.project.name === task.project.name
    );
    if (index === -1) {
      if (this.topTasks.length < 7) {
        this.topTasks.push(new TaskCount(task, 1));
        this.tasksStatChanged$.next(this.topTasks);
      }
    } else {
      this.topTasks[index].count++;
      this.tasksStatChanged$.next(this.topTasks);
    }
  }

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

    // Sort the array based on the second element
    items.sort((left: TaskCount, right: TaskCount) =>
      right.count - left.count
    );

    this.topTasks = items.slice(0, 7);

  }

  getDayEventKey(date: Date): string {
    return `ev-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}}`;
  }

  getDayEvents(date: Date): Event[] {
    const key = this.getDayEventKey(date);
    return JSON.parse(localStorage.getItem(key));
  }

  addProject(project: Project): void {
    const projects: Project[] = this.getProjects();
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));

    this.projectAdded$.next(project);
  }
  constructor() {
    //    localStorage.clear();
    //    const projects = [ new Project('Almoço'), new Project('Merenda'), new Project('Janta')];
    //    localStorage.setItem('projects', JSON.stringify(projects));
  }

  getProjects(): Project[] {
    const s = localStorage.getItem('projects');
    return JSON.parse(s);
  }

}
