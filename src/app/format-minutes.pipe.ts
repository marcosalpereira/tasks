import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateUtil } from './date-util';

@Pipe({
  name: 'formatMinutes'
})
export class FormatMinutesPipe implements PipeTransform {

  transform(minutes: number): string {
    return DateUtil.formatDecimalHour(minutes);
  }

}
