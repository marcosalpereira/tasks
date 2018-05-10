import { Component, OnInit } from '@angular/core';
import { ApropriateService } from '../apropriate.service';
import { ImportCsvService } from '../import-csv.service';
import { ElectronService } from '../electron.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private apropriateService: ApropriateService,
    private importCsvService: ImportCsvService,
    private electronService: ElectronService) {
  }

  apropriate() {
    this.apropriateService.apropriate();
  }

  importCsv() {
    const csvFiles = this.electronService.remote.dialog.showOpenDialog({
        title: 'Choose CSV File',
        properties: ['openFile'],
        filters: [
          {name: 'CSV', extensions: ['csv']},
          {name: 'All Files', extensions: ['*']}
        ]
      });

    if (csvFiles) {
      this.importCsvService.importCsv(csvFiles[0]);
    }
  }

}
