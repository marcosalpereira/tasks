import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { StorageService } from './storage.service';

@Injectable()
export class TaskDaoService {
  private tasks: Task[];

  constructor(
    private storageService: StorageService) { }

  dataInit(): void {
    this.tasks = undefined;
  }

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
    this.storageService.setItem(`tasks.${task.code}`, task);
  }

  findByCode(code: number): Task {
    return this.storageService.getItem(`tasks.${code}`);
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
    const codes: number[] = this.storageService.getItem('tasks') || [];
    return codes
        .map(code => this.findByCode(code));
  }
  private writeAllTasks(): void {
    const codes = this.getTasks()
      .map(task => task.code);
    this.storageService.setItem('tasks', codes);
  }

}
