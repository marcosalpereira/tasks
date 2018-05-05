import { Component, OnInit } from '@angular/core';
import { ApropriateService } from '../apropriate.service';
import { ImportCsvService } from '../import-csv.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private apropriateService: ApropriateService,
    private importCsvService: ImportCsvService) {
  }

  apropriate() {
    this.apropriateService.apropriate();
  }

  importCsv() {
    this.importCsvService.importCsv('/home/marcos/git/tasks/src/selenium/apropriacao.csv');
  }

}
