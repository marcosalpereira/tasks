import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Config } from './config.model';
import { Event } from './event.model';

@Injectable()
export class EventDaoService {
  private events: Event[];
  
  private config: Config;
  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }
  
  selectLastEvents(): Event[] {
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
  
  getEvents() {
    return this.events;
  }

  persist(event: Event) {
    const key = this.getKey(event.id);
    localStorage.setItem(key, JSON.stringify(event));
  }

  find(id: number): Event {
    const key = this.getKey(id);
    return JSON.parse(localStorage.getItem(key)) || undefined;
  }

  selectLastEvent(): Event {
    const key = this.getKey(id);
    return JSON.parse(localStorage.getItem(key)) || undefined;
  }

  getKey(id: number): string {
    return `ev-${id}`;
  }

}
