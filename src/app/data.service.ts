import { Injectable, OnInit } from '@angular/core';
import { Project } from './project.model';
import { Task, TaskCount } from './task.model';
import { Event } from './event.model';
import * as moment from 'moment';

@Injectable()
export class DataService {

  public topTasks: TaskCount[] = [];

  addEvent(task: Task): void {
    const date = new Date();
    const key = this.getDayEventKey(date);
    const events: Event[] = JSON.parse(localStorage.getItem(key));
    events.push(new Event(task, date));
    localStorage.setItem(key, JSON.stringify(events));
  }

  getEvents(): Event[] {
    const events: Event[] = [];
    const m = moment();
    for (let i = 0; i < 20; i++) {
      const dayEvents = this.getDayEvents(m.toDate());
      events.push(...dayEvents);
      m.subtract(1, 'day');
    }
    this.updateTopTasks(events);
    return events;
  }

  updateTopTasks(events: Event[]): void {

    const freq = events.reduce(function (map, event: Event) {
      const key = JSON.stringify(event.task);
      map[key] ? map[key]++ : map[key] = 1;
      return map;
    }, new Map());

    const items = Object.keys(freq).map(function(key) {
      return [key, freq[key]];
    });
  
    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    this.topTasks = a.slice(0, 7);
  }

  getDayEventKey(date: Date): string {
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}}`;
  }

  getDayEvents(date: Date): Event[] {
    const key = this.getDayEventKey(date);
    return JSON.parse(localStorage.getItem(key));
  }

  addProject(project: Project): void {
    const projects: Project[] = this.getProjects();
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
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
