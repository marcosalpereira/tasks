import * as moment from 'moment';

export class WeekRange {
    constructor(
        public startDate: Date,
        public endDate: Date
    ) { }
}

export class DateUtil {

    public static weekRange(date: Date): WeekRange {
        const m = moment(date);
        const weekday = m.weekday();
        m.subtract(weekday, 'days');
        return new WeekRange(m.toDate(), m.add(6, 'days').toDate());
    }

    public static add(date: Date, n: number): Date {
        const m = moment(date);
        m.add(n, 'days');
        return m.toDate();
    }

    public static durationMinutes(start: moment.Moment, end: moment.Moment): number {
        return end.diff(start, 'minutes');
    }

    public static formatHour(mins: number): string {
        if (mins === 0) {
            return '';
        }
        return Math.trunc(mins / 60) + ':' + DateUtil.lpadMask('00', (mins % 60));
    }

    public static formatDecimalHour(mins: number): string {
        if (mins === 0) {
            return '';
        }
        return (mins / 60).toFixed(2);
    }

    private static lpadMask(mask: string, value: any): string {
        return ((mask + value).slice(-mask.length));
    }

}
