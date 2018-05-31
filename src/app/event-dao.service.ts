import { Injectable } from '@angular/core';
import { Event } from './event.model';
import { TaskDaoService } from './task-dao.service';
import { StorageService } from './storage.service';

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

  deleteAll(): any {
    this.storageService.clear();
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
    const lastEventsIds = this.lastEvents
      .slice(0, MAX_LAST_EVENTS)
      .map(event => event.id);
    this.storageService.setItem('events.last', lastEventsIds);
  }

  delete(event: Event): void {
    this.storageService.removeItem(`events.${event.id}`);

    this.lastEvents = this.lastEvents.filter(ev => ev.id !== event.id);
    this.writeLastEvents();
  }

  persist(event: Event): void {
    const events = this.getEvents();
    if (event.id) {
      const index = events.findIndex(e => e.id === event.id);
      events[index] = event;
    } else {
      event.id = event.startDate.getTime();
      events.unshift(event);
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
      next: event.next && event.id,
      previous: event.previous && event.previous.id,
      task: event.task.code,
      startDate: event.startDate
    };
    return entity;
  }

  private toModel(entity: EventEntity): Event {
    const task = this.taskDao.findByCode(entity.task);
    const model = new Event(task, entity.startDate);
    model.id = entity.id;
    model.endDate = entity.endDate;
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
    event.previous = eventEntity.previous && this.toModel(this.load(eventEntity.previous));
    event.next = eventEntity.next && this.toModel(this.load(eventEntity.next));
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
  public next: number;
  public previous: number;
  public task: number;
  public startDate: Date;
}

