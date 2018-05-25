import { Project } from './project.model';

export class Task {
    public counter = 0;
    constructor(
        public project: Project,
        public id: number,
        public name: string) {}
}
