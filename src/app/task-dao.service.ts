import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { StorageService } from './storage.service';
import { ConfigService } from './config.service';

@Injectable()
export class TaskDaoService {
  private tasks: Task[];

  constructor(
    private storageService: StorageService) {}

  dataInit(): void {
    this.tasks = undefined;
  }

  delete(task: Task) {
    this.storageService.removeItem(`tasks.${task.id}`);
    this.tasks = this.tasks.filter(t => task.id !== task.id);
  }

  persist(task: Task): void {
    const tasks = this.getTasks();
    if (task.id) {
      const index = tasks.findIndex(e => e.id === task.id);
      tasks[index] = task;
    } else {
      task.id = new Date().getTime();
      tasks.push(task);
      this.writeAllTasks();
    }
    this.storageService.setItem(`tasks.${task.id}`, task);
  }

  findById(id: number): Task {
    return this.storageService.getItem(`tasks.${id}`);
  }

  findByCode(code: number): Task {
    return this.getTasks().find(task => task.code === code);
  }

  getTopTasks(): any {
    return this.getTasks()
      .sort((left: Task, right: Task) => right.counter - left.counter);
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
        .map(code => this.findById(code));
  }
  private writeAllTasks(): void {
    const ids = this.getTasks()
      .map(task => task.id);
    this.storageService.setItem('tasks', ids);
  }

}
