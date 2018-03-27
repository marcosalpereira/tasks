import { Project } from './project.model';
import { Task } from './task.model';
import { Event } from './event.model';

export class Summary {
    public taskSummaryMap: Map<number, TaskSummary> = new Map();
    constructor(
        public startDate: Date,
        public endDate: Date,
    ) {
    }

    public getTaskSummary(): TaskSummary[] {
        return Object.keys(this.taskSummaryMap)
            .map(key => this.taskSummaryMap[key]);
    }
}

export class TaskSummary {
    public minutesRegistered: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    public minutesPending: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    public events: Event[] = [];
    constructor(public task: Task) {}

}

