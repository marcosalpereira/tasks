import { Component, OnInit } from '@angular/core';
import { Summary } from '../summary.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  summarys: Summary[];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.summarys = this.dataService.getSummary();
  }

}
