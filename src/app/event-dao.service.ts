import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Config } from './config.model';
import { Event } from './event.model';
import { TaskDaoService } from './task-dao.service';

const MAX_LAST_EVENTS = 30;

@Injectable()
export class EventDaoService {
  private lastEvents: Event[];
  private config: Config;

  constructor(
    private configService: ConfigService,
    private taskDao: TaskDaoService) {
    this.config = this.configService.getConfig();
  }

  deleteAll(): any {
    localStorage.clear();
    this.lastEvents = undefined;
  }

  getEvents() {
    if (!this.lastEvents) {
      this.lastEvents = this.readLastEvents();
    }
    return this.lastEvents;
  }

  private readLastEvents(): Event[] {
    const lastEventsIds: number[] = JSON.parse(localStorage.getItem('tasks.events.last')) || [];
    return lastEventsIds
      .map(id => this.find(id));
  }
  private writeLastEvents(): void {
    const lastEventsIds = this.lastEvents
      .slice(0, MAX_LAST_EVENTS)
      .map(event => event.id);
    localStorage.setItem('tasks.events.last', JSON.stringify(lastEventsIds));
  }

  delete(event: Event): void {
    const key = this.getKey(event.id);
    localStorage.removeItem(key);

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
    const key = this.getKey(event.id);
    localStorage.setItem(key, this.toEntity(event));
  }

  private toEntity(event: Event): string {
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
    return JSON.stringify(entity);
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
    const key = this.getKey(id);
    return JSON.parse(localStorage.getItem(key));
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

  getKey(id: number): string {
    return `ev-${id}`;
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

