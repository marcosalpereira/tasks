import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Event } from './event.model';

@Pipe({
  name: 'interval'
})
export class IntervalPipe implements PipeTransform {

  transform(event: Event): string {
    const start = moment(event.startDate);
    let interval = start.format('ddd DD/MM/YY HH:mm:ss');
    if (event.endDate) {
      const end = moment(event.endDate);
      interval += ' - ' + end.format('HH:mm:ss')
        + ' (' + this.duration(start, end) + ')';
    }
    return interval;
  }

  duration(start: moment.Moment, end: moment.Moment) {
    const milis = end.diff(start);
    const mins = milis / 1000 / 60;
    return (mins / 60).toFixed() + ':' + (mins % 60).toFixed();
  }

}
