import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[appTimeValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: TimeValidatorDirective, multi: true}]
})
export class TimeValidatorDirective implements Validator {
  @Input() minTime: Date;
  @Input() maxTime: Date;

  validate(control: AbstractControl): {[key: string]: any} | null {
    if (control.value) {
      const inputMoment = moment(control.value, 'HH:mm', true).startOf('minute');

      if (!inputMoment.isValid()) {
        return {'invalidTime': {value: control.value}};
      }
      if (this.minTime && this.compareTo(inputMoment, this.minTime) < 0) {
        return {'invalidTimeMin': {value: control.value}};
      }
      if (this.maxTime && this.compareTo(inputMoment, this.maxTime) > 0) {
        return {'invalidTimeMax': {value: control.value}};
      }
    }
    return null;
  }

  private compareTo(leftMoment: moment.Moment, right: any): number {
    const rightMoment = moment(right).startOf('minute')
      .year(leftMoment.year())
      .month(leftMoment.month())
      .date(leftMoment.date());
    const leftDate = leftMoment.toDate();
    const rightDate = rightMoment.toDate();
    return leftDate.getTime() - rightDate.getTime();
  }
}
