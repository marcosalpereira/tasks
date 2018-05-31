import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable()
export class StorageService {

  constructor(
    private configService: ConfigService) { }

  getItem(context: string): any {
    const key = this.getKey(context);
    return JSON.parse(localStorage.getItem(key));
  }

  removeItem(context: string): void {
    const key = this.getKey(context);
    localStorage.removeItem(key);
  }

  setItem(context: string, value: any): void {
    const key = this.getKey(context);
    localStorage.setItem(key, JSON.stringify(value));
  }

  clear() {
    localStorage.clear();
  }

  private getKey(context: any): string {
    return `tasks.${this.getKeyPrefix()}.${context}`;
  }

  private getKeyPrefix(): string {
    return this.configService.getConfig().cpf;
  }


}
