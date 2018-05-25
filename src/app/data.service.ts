import { Injectable, OnInit } from '@angular/core';
import { Project } from './project.model';
import { Task } from './task.model';
import { Event } from './event.model';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import { Summary, TaskSummary } from './summary.model';

import { WeekRange, DateUtil } from './date-util';
import { Config } from './config.model';
import { EventDaoService } from './event-dao.service';
import { TaskDaoService } from './task-dao.service';
import { ProjectDaoService } from './project-dao.service';
import { last } from '@angular/router/src/utils/collection';

export interface PreviousNextEvent { previous?: Event; next?: Event; }

@Injectable()
export class DataService {
  public eventsChanged$ = new Subject<Event[]>();
  public projectsChanged$ = new Subject<Project[]>();
  public tasksStatChanged$ = new Subject<Task[]>();

  constructor(
    private eventDao: EventDaoService,
    private taskDao: TaskDaoService,
    private projectDao: ProjectDaoService) {
  }

  markEventAsRegistered(event: Event): void {
    event.registered = true;
    this.eventDao.persist(event);
  }

  getTopTasks() {
    return this.taskDao.getTopTasks();
  }

  stopTask(event: Event) {
    event.endDate = new Date();
    this.eventDao.persist(event);
    this.eventsChanged$.next(this.eventDao.getEvents());
  }

  updateEvent(event: Event) {
    this.eventDao.persist(event);
    this.eventsChanged$.next(this.eventDao.getEvents());
  }

  deleteEvent(event: Event) {
    this.eventDao.delete(event);
    this.eventsChanged$.next(this.eventDao.getEvents());
  }

  bulkImportAddEvent(task: Task, startDate: Date, endDate: Date, registered: boolean, remarks: string) {
    const event: Event = new Event(task, startDate);
    event.registered = registered;
    event.remarks = remarks;
    event.endDate = endDate;
    this.eventDao.persist(event);
  }

  startTask(project: Project, taskId: number, taskName: string, remarks: string): void {
    const date = new Date();
    const lastEvent: Event = this.eventDao.selectLastEvent();

    const task: Task = this.getTask(project, taskId, taskName);
    task.counter++;
    this.taskDao.persist(task);
    this.tasksStatChanged$.next(this.getTopTasks());

    const newEvent = new Event(task, date);
    newEvent.previous = lastEvent;
    newEvent.remarks = remarks;
    this.eventDao.persist(newEvent);

    if (lastEvent) {
      if (!lastEvent.endDate) {
        lastEvent.endDate = date;
        lastEvent.next = newEvent;
        this.eventDao.persist(lastEvent);
      }
    }

    this.eventsChanged$.next(this.getEvents());
  }

  getEvents(): Event[] {
    return this.eventDao.getEvents();
  }

  private getTask(project, id, name) {
    return this.taskDao.find(id) || new Task(project, id, name);
  }

  addProject(projectName: string): void {
    const project = this.getProject(projectName);
    this.projectsChanged$.next(this.projectDao.getProjects());
  }

  private getProject(name: string) {
    return this.projectDao.find(name) || new Project(name);
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
    return this.projectDao.select();
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
