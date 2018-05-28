import { Project } from './project.model';

export class Task {
    public id: number;
    public counter = 0;
    constructor(
        public project: Project,
        public code: number,
        public name: string) {}
}
