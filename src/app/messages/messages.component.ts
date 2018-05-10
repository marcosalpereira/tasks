import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from '../messages.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  private errors$: Subscription;
  errors: string[] = [];

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {
    this.errors$ = this.messagesService.error$.subscribe(
      errors => this.errors = errors)
    ;
  }

  ngOnDestroy() {
    this.errors$.unsubscribe();
  }

}
