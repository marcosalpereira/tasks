import { Component, OnInit, OnDestroy } from '@angular/core';
import { Summary } from '../summary.model';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  eventsChanged$: Subscription;
  summarys: Summary[];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.summarys = this.dataService.getSummary();

    this.eventsChanged$ = this.dataService.eventsChanged$.subscribe(
      _ => this.summarys = this.dataService.getSummary()
    );
  }

  ngOnDestroy(): void {
    this.eventsChanged$.unsubscribe();
  }


}
