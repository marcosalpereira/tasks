import { Task } from './task.model';

export class Event {
    constructor(public task: Task, public date: Date, public registered: boolean = false) { }
}
