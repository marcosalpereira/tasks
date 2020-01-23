import { Injectable } from '@angular/core';
import { Event } from './event.model';
import { TaskDaoService } from './task-dao.service';
import { StorageService } from './storage.service';
import * as moment from 'moment';
import { Task } from './task.model';

const MAX_LAST_EVENTS = 30;

@Injectable()
export class EventDaoService {
  private lastEvents: Event[];

  constructor(
    private storageService: StorageService,
    private taskDao: TaskDaoService) {
  }

  dataInit(): void {
    this.lastEvents = undefined;
  }

  getEvents() {
    if (!this.lastEvents) {
      this.lastEvents = this.readLastEvents();
    }
    return this.lastEvents;
  }

  private readLastEvents(): Event[] {
    const lastEventsIds: number[] = this.storageService.getItem('events.last') || [];
    return lastEventsIds
      .map(id => this.find(id));
  }
  private writeLastEvents(): void {
    this.lastEvents = this.lastEvents
      .slice(0, MAX_LAST_EVENTS)
      .sort( (l, r) => r.startDate.getTime() - l.startDate.getTime());

    const lastEventsIds = this.lastEvents
      .map(event => event.id);
    this.storageService.setItem('events.last', lastEventsIds);
  }

  deleteAll(task: Task) {
    const events = this.getEvents();
    events.forEach(event => {
      if (event.task.id === task.id) {
        this.storageService.removeItem(`events.${event.id}`);
        this.lastEvents = this.lastEvents.filter(e => e.id !== event.id);
      }
    });
    const lastEventsIds = this.lastEvents
      .map(event => event.id);
    this.storageService.setItem('events.last', lastEventsIds);
  }

  delete(event: Event): void {
    this.storageService.removeItem(`events.${event.id}`);

    this.lastEvents = this.lastEvents.filter(ev => ev.id !== event.id);
    this.writeLastEvents();
  }

  persist(event: Event): void {
    let forceWriteEvents = false;
    const events = this.getEvents();
    if (event.id) {
      const index = events.findIndex(e => e.id === event.id);
      if (!moment(events[index].startDate).isSame(event.startDate, 'day')) {
        forceWriteEvents = true;
      }
      events[index] = event;
    } else {
      event.id = event.startDate.getTime();
      events.unshift(event);
      forceWriteEvents = true;
    }
    if (forceWriteEvents) {
      this.writeLastEvents();
    }
    this.storageService.setItem(`events.${event.id}`, this.toEntity(event));
  }

  private toEntity(event: Event): EventEntity {
    const entity: EventEntity = {
      id: event.id,
      endDate: event.endDate,
      registered: event.registered,
      remarks: event.remarks,
      task: event.task.id,
      startDate: event.startDate
    };
    return entity;
  }

  private toModel(entity: EventEntity): Event {
    const task = this.taskDao.findById(entity.task);
    const model = new Event(task, new Date(entity.startDate));
    model.id = entity.id;
    model.endDate = entity.endDate ? new Date(entity.endDate) : undefined;
    model.registered = entity.registered;
    model.remarks = entity.remarks;
    return model;
  }

  private load(id: number): EventEntity {
    return this.storageService.getItem(`events.${id}`);
  }

  find(id: number): Event {
    const eventEntity = this.load(id);
    const event = this.toModel(eventEntity);
    return event;
  }

  selectLastEvent(): Event {
    return this.lastEvents[0] || undefined;
  }

}

class EventEntity {
  public id: number;
  public endDate: Date;
  public registered: boolean;
  public remarks: string;
  public task: number;
  public startDate: Date;
}

