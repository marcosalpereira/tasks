import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ConfigService } from './config.service';

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
  }

}
