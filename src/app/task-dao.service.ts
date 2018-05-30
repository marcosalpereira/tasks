import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable()
export class TaskDaoService {
  private tasks: Task[];

  constructor(private dataService: DataService) { }

  persist(task: Task): void {
    const tasks = this.getTasks();
    if (task.id) {
      const index = tasks.findIndex(e => e.id === task.id);
      tasks[index] = task;
    } else {
      task.id = task.code;
      tasks.push(task);
      this.writeAllTasks();
    }
    const key = this.getKey(task.code);
    localStorage.setItem(key, JSON.stringify(task));
  }

  deleteAll(): any {
    localStorage.clear();
    this.tasks = undefined;
  }

  findByCode(code: number): Task {
    const key = this.getKey(code);
    return JSON.parse(localStorage.getItem(key));
  }

  getKey(code: number): string {
    return `tc-${code}`;
  }

  getTopTasks(): any {
    return this.getTasks()
      .sort((left: Task, right: Task) => right.counter - left.counter)
      .slice(0, 7);
  }

  getTasks() {
    if (!this.tasks) {
      this.tasks = this.readAllTasks();
    }
    return this.tasks;
  }

  private readAllTasks(): Task[] {
    const key = 
    const codes: number[] = JSON.parse(localStorage.getItem('tasks.all')) || [];
    return codes
        .map(code => this.findByCode(code));
  }
  private writeAllTasks(): void {
    const codes = this.getTasks()
      .map(task => task.code);
    localStorage.setItem('tasks.all', JSON.stringify(codes));
  }

}
