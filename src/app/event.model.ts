import { Task } from './task.model';

export class Event {
    constructor(public task: Task, date: Date) {}
}
