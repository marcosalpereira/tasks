import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Config } from '../config.model';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  config: Config;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.config = this.dataService.getConfig();
  }

  onSubmit() {
    this.dataService.setConfig(this.config);
  }

}
