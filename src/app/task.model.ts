import {Project} from './project.model';

export class Task {
    constructor(
        public project: Project,
        public id: number,
        public name: string) {}
}

export class TaskCount {
    constructor(public task: Task, public count: number) {}
}

