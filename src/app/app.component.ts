import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ConfigService } from './config.service';
import { Config } from './config.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showConfigOpen = true;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.showConfigOpen = this.configService.getConfig().cpf === undefined;
    this.configService.configChanged$.subscribe(
      (config: Config) => this.showConfigOpen = config.cpf === undefined);
  }

}
