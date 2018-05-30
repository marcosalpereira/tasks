import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showConfigOpen = true;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.showConfigOpen = this.dataService.getConfig().cpf === undefined;
  }

}
