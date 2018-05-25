import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable()
export class TaskDaoService {
  private tasks: Task[];

  constructor() { }

  persist(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      this.tasks.push(task);
      this.writeAllTasks();
    }
    const key = this.getKey(task.id);
    localStorage.setItem(key, JSON.stringify(task));
  }

  find(id: number): Task {
    const key = this.getKey(id);
    return JSON.parse(localStorage.getItem(key));
  }

  getKey(id: number): string {
    return `ts-${id}`;
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
    const ids: number[] = JSON.parse(localStorage.getItem('tasks.all')) || [];
    return ids
        .map(id => this.find(id));
  }
  private writeAllTasks(): void {
    const ids = this.getTasks()
      .map(task => task.id);
    localStorage.setItem('tasks.all', JSON.stringify(ids));
  }

}
