import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

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
    this.info$.next(this.infos.filter(i => i !== msg));
  }

  clearError(msg: any): any {
    this.error$.next(this.errors.filter(i => i !== msg));
  }

}
