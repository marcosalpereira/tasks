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
    if (!event.id) {
      event.id = event.startDate.getTime();
      this.lastEvents.unshift(event);
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
      next: event.next.id || undefined,
      previous: event.previous.id || undefined,
      task: event.task.id,
      startDate: event.startDate
    };
    return JSON.stringify(entity);
  }

  private toModel(str: string): string {
    const entity: EventEntity = JSON.parse(str);
    const model = {
      id: entity.id,
      endDate: entity.endDate,
      registered: entity.registered,
      remarks: entity.remarks,
      next: this.find(entity.next) || undefined,
      previous: this.find(entity.previous) || undefined,
      task: this.taskDao.find(entity.task),
      startDate: entity.startDate
    };
    return JSON.stringify(entity);
  }

  find(id: number): Event {
    const key = this.getKey(id);
    return JSON.parse(localStorage.getItem(key));
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

