import {Project} from './project.model';

export class Task {
    constructor(public project: Project, public name: string) {}
}
