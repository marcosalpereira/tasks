import { Component, OnInit } from '@angular/core';
import { ApropriateService } from '../apropriate.service';
import { ImportCsvService } from '../import-csv.service';
import { ElectronService } from '../electron.service';
import { BrowserService } from '../browser.service';
import { ExportCsvService } from '../export-csv.service';
import { ConfigService } from '../config.service';
import { Config } from '../config.model';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  apropriando = false;
  config: Config;

  constructor(
    private apropriateService: ApropriateService,
    private importCsvService: ImportCsvService,
    private exportCsvService: ExportCsvService,
    private electronService: ElectronService,
    private browserService: BrowserService,
    private configService: ConfigService,
    private appComponent: AppComponent) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    this.configService.configChanged$.subscribe(
      (config: Config) => this.config = config);

  }

  openMenu() {
    this.appComponent.meny.open();
  }

  apropriate() {
    this.apropriando = true;
    setTimeout(() => {
      this.apropriateService.apropriate(_ => this.apropriando = false);
    }, 500);
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

  exportCsv() {
    this.exportCsvService.exportCsv();
  }

  openBi() {
    this.browserService.openBiCorporativo();
  }

}
