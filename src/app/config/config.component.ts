import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Config } from '../config.model';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  config: Config;

  constructor(
    private configService: ConfigService,
    private dataService: DataService,
    private appComponent: AppComponent) { }

  onReset() {
    this.config = this.configService.getConfig();
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
  }

  onSubmit() {
    this.configService.setConfig(this.config);
    this.dataService.reloadAll();
    this.appComponent.meny.close();
  }

}
