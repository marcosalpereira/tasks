import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class MessagesService {
  error$ = new Subject<string[]>();
  private errors: string[] = [];

  clear() {
    this.errors = [];
  }

  error(msg: string): void {
    this.errors.push(msg);
    this.error$.next(this.errors);
  }

}
