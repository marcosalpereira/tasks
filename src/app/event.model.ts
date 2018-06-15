import { Task } from './task.model';

export class Event {
    public id: number;
    public endDate: Date;
    public registered = false;
    public remarks = '';
    constructor(
        public task: Task,
        public startDate: Date
    ) { }
}

export class NextPreviousEvent {
    public next: Event;
    public previous: Event;
}
