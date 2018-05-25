import { Task } from './task.model';

export class Event {
    public id: number;
    public endDate: Date;
    public registered = false;
    public remarks = '';
    public next: Event;
    public previous: Event;
    constructor(
        public task: Task,
        public startDate: Date
    ) { }
}

