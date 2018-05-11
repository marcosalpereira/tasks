import { Component, OnInit, OnDestroy } from '@angular/core';
import { Summary } from '../summary.model';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';
import { DateUtil } from '../date-util';

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

  calcDate(summary: Summary, i): Date {
    return DateUtil.add(summary.startDate, i);
  }

  isAtipicTime(minutes: number) {
    return minutes <= 400 || minutes >= 480;
  }

  ngOnDestroy(): void {
    this.eventsChanged$.unsubscribe();
  }


}
