import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Event } from './event.model';
import { DateUtil } from './date-util';

@Pipe({
  name: 'eventDuration'
})
export class EventDurationPipe implements PipeTransform {

  transform(event: Event): string {
    const start = moment(event.startDate);
    if (event.endDate) {
      const end = moment(event.endDate);
      const minutes = DateUtil.durationMinutes(start, end);
      return DateUtil.formatHour(minutes);
    } else {
      return '';
    }
  }
}
