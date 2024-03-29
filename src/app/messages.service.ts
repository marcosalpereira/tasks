import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class MessagesService {
  error$ = new Subject<string[]>();
  private errors: string[] = [];
  info$ = new Subject<string[]>();
  private infos: string[] = [];

  clear() {
    this.infos = [];
    this.errors = [];
  }

  error(msg: string): void {
    this.errors.push(msg);
    this.error$.next(this.errors);
  }

  info(msg: string): void {
    this.infos.push(msg);
    this.info$.next(this.infos);
  }

  clearInfo(msg: any) {
    this.infos = this.infos.filter(i => i !== msg);
    this.info$.next(this.infos);
  }

  clearError(msg: any): any {
    this.errors = this.errors.filter(i => i !== msg);
    this.error$.next(this.errors);
  }

}
