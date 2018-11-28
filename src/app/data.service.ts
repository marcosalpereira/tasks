import { Injectable, OnInit } from '@angular/core';
import { Project } from './project.model';
import { Task } from './task.model';
import { Event, NextPreviousEvent } from './event.model';
import * as moment from 'moment';
import { Subject, BehaviorSubject } from 'rxjs';
import { Summary, TaskSummary } from './summary.model';

import { WeekRange, DateUtil } from './date-util';
import { Config } from './config.model';
import { EventDaoService } from './event-dao.service';
import { TaskDaoService } from './task-dao.service';
import { ProjectDaoService } from './project-dao.service';
import { ConfigService } from './config.service';

@Injectable()
export class DataService {
  public eventsChanged$ = new BehaviorSubject<Event[]>(undefined);
  public projectsChanged$ = new Subject<Project[]>();
  public topTasksChanged$ = new Subject<Task[]>();

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
    this.fireEventsChanged();
  }

  updateEvent(event: Event) {
    this.eventDao.persist(event);
    this.fireEventsChanged();
  }

  deleteEvent(event: Event) {
    this.eventDao.delete(event);
    this.fireEventsChanged();
  }

  reloadAll(): void {
    this.taskDao.dataInit();
    this.eventDao.dataInit();
    this.projectDao.dataInit();
    this.fireEventsChanged();
    this.fireProjectsChanged();
    this.fireTopTasksChanged();
  }

  bulkImportBegin() {
  }

  bulkImportEnd() {
    this.reloadAll();
  }

  bulkImportAddEvent(task: Task, startDate: Date, endDate: Date, registered: boolean, remarks: string): Event {
    const event: Event = new Event(task, startDate);
    event.registered = registered;
    event.remarks = remarks;
    event.endDate = endDate;
    this.eventDao.persist(event);
    return event;
  }

  bulkImportAddProject(projectName: string): Project {
    const project = this.getProject(projectName);
    this.projectDao.persist(project);
    return project;
  }

  bulkImportAddTask(project: Project, taskCode: number, taskName: string): Task {
    const task: Task = this.getTask(project, taskCode, taskName);
    task.counter++;
    this.taskDao.persist(task);
    return task;
  }

  startTask(project: Project, taskCode: number, taskName: string, remarks: string, date = new Date()): void {
    const lastEvent: Event = this.eventDao.selectLastEvent();

    const task: Task = this.getTask(project, taskCode, taskName);
    task.counter++;
    this.taskDao.persist(task);
    this.fireTopTasksChanged();

    const newEvent = new Event(task, date);
    newEvent.remarks = remarks;
    this.eventDao.persist(newEvent);

    if (lastEvent) {
      if (!lastEvent.endDate) {
        lastEvent.endDate = date;
      }
      this.eventDao.persist(lastEvent);
    }

    this.fireEventsChanged();
  }

  private fireTopTasksChanged() {
    this.topTasksChanged$.next(this.getTopTasks());
  }

  getEvents(): Event[] {
    return this.eventDao.getEvents();
  }

  private getTask(project, code, name) {
    return this.taskDao.findByCode(code) || new Task(project, code, name);
  }

  addProject(projectName: string): Project {
    const project = this.getProject(projectName);
    this.projectDao.persist(project);
    this.fireProjectsChanged();
    return project;
  }

  private getProject(name: string) {
    return this.projectDao.find(name) || new Project(name);
  }

  fireProjectsChanged() {
    this.projectsChanged$.next(this.getProjects());
  }

  fireEventsChanged() {
    this.eventsChanged$.next(this.getEvents());
  }

  getProjects(): Project[] {
    return this.projectDao.getProjects();
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
        let taskSummaryMap = summary.taskSummaryMap[event.task.code];
        if (!taskSummaryMap) {
          taskSummaryMap = new TaskSummary(event.task);
          summary.taskSummaryMap[event.task.code] = taskSummaryMap;
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

  findEvent(id: number): Event {
    return this.eventDao.find(id);
  }

  findNextPreviousEvent(event: Event): NextPreviousEvent {
    const events = this.eventDao.getEvents();
    const index = events.findIndex(e => e.id === event.id);
    const npe = new NextPreviousEvent();
    if (index >= 0) {
      npe.next = events[index - 1];
    }
    if (index >= 0 && index < events.length - 1) {
      npe.previous = events[index + 1];
    }
    return npe;
  }


}
