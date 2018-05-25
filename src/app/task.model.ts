import { Project } from './project.model';

export class Task {
    public counter = 0;
    public id: number;
    constructor(
        public project: Project,
        public name: string) {
            this.id = new Date().getTime();
    }
}

export class TaskCount {
    constructor(public task: Task, public count: number) { }
}

