import { Task } from './task.model';

export class Event {
    public endDate: Date;
    public registered = false;
    constructor(
        public task: Task,
        public startDate: Date
    ) { }
}
