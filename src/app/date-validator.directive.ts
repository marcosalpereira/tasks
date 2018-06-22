import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[appDateValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: DateValidatorDirective, multi: true}]
})
export class DateValidatorDirective implements Validator {
  @Input() minDate: Date;
  @Input() maxDate: Date;

  validate(control: AbstractControl): {[key: string]: any} | null {
    const val = control.value;
    if (val) {
      const d = moment(val, 'DD/MM/YY', true).startOf('day');
      if (!d.isValid()) {
        return {'invalidDate': {value: control.value}};
      }
      if (this.minDate && d.isBefore(moment(this.minDate).startOf('day'))) {
        return {'invalidDateMin': {value: control.value}};
      }
      if (this.maxDate && d.isAfter(moment(this.maxDate).startOf('day'))) {
        return {'invalidDateMax': {value: control.value}};
      }
    }
    return null;
  }

}
