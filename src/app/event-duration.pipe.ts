import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateUtil } from './date-util';

@Pipe({
  name: 'eventDuration'
})
export class EventDurationPipe implements PipeTransform {

  transform(startDate: Date, endDate: Date): string {
    const start = moment(startDate);
    if (endDate) {
      const end = moment(endDate);
      const minutes = DateUtil.durationMinutes(start, end);
      return DateUtil.formatHour(minutes);
    } else {
      return '';
    }
  }
}
