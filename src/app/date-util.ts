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
        return new WeekRange(m.toDate(), m.add(7, 'days').toDate());
    }

    public static durationMinutes(start: moment.Moment, end: moment.Moment): number {
        const milis = end.diff(start);
        return milis / 1000 / 60;
    }

    public static formatHour(mins: number): string {
        return (mins / 60).toFixed() + ':' + DateUtil.lpadMask('00', (mins % 60).toFixed());
    }

    private static lpadMask(mask: string, value: any): string {
        return ((mask + value).slice(-mask.length));
    }

}
