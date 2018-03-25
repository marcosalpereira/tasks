import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Event } from './event.model';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(event: Event): string {
    const start = moment(event.startDate);
    if (event.endDate) {
      const end = moment(event.endDate);
      return this.duration(start, end);
    }
    return '';
  }

  duration(start: moment.Moment, end: moment.Moment) {
    const milis = end.diff(start);
    const mins = milis / 1000 / 60;
    return (mins / 60).toFixed() + ':' + (mins % 60).toFixed();
  }

}
