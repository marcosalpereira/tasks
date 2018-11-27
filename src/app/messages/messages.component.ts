import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from '../messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  private errors$: Subscription;
  errors: string[] = [];
  private infos$: Subscription;
  infos: string[] = [];

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {
    this.errors$ = this.messagesService.error$.subscribe(
      errors => this.errors = errors);
    this.infos$ = this.messagesService.info$.subscribe(
        infos => this.infos = infos);
    }

  ngOnDestroy() {
    this.errors$.unsubscribe();
    this.infos$.unsubscribe();
  }

  clearInfo(info) {
    this.messagesService.clearInfo(info);
  }
  clearError(error) {
    this.messagesService.clearError(error);
  }

}
