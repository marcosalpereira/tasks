import { Task } from './task.model';

export class Event {
    public endDate: Date;
    public registered = false;
    public remarks = '';
    public next: Event;
    public previous: Event;
    constructor(
        public id: number,
        public task: Task,
        public startDate: Date
    ) { }
}
