import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ConfigService } from './config.service';
import { Config } from './config.model';
import moment from 'moment';
import { VersionService } from './version.service';
import { ElectronService } from './electron.service';
import { ExportCsvService } from './export-csv.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showConfigOpen = true;
  meny: any;

  constructor(
    private exportCsvService: ExportCsvService,
    private configService: ConfigService,
    private dataService: DataService,
    private versionMigrationService: VersionService,
    private electronService: ElectronService,
  ) { }

  ngOnInit() {

    document.addEventListener('keydown', e => {
      if (e.which === 123) {  // F12
        this.electronService.remote.getCurrentWindow().webContents.openDevTools();
      }
    });

    moment.locale('pt-br');
    this.versionMigrationService.migrateData();

    this.showConfigOpen = this.configService.getConfig().cpf === undefined;
    this.configService.configChanged$.subscribe(
      (config: Config) => this.showConfigOpen = config.cpf === undefined);

    this.meny = require('assets/meny.js').create({
      // The element that will be animated in from off screen
      menuElement: document.querySelector('.meny'),

      // The contents that gets pushed aside while Meny is active
      contentsElement: document.querySelector('.meny-content'),

      // The alignment of the menu (top/right/bottom/left)
      position: 'left',

      // The height of the menu (when using top/bottom position)
      height: 200,

      // The width of the menu (when using left/right position)
      width: 360,

      // The angle at which the contents will rotate to.
      angle: 30,

      // The mouse distance from menu position which can trigger menu to open.
      threshold: 0,

      // Width(in px) of the thin line you see on screen when menu is in closed position.
      overlap: 6,

      // The total time taken by menu animation.
      transitionDuration: '0.5s',

      // Transition style for menu animations
      transitionEasing: 'ease',

      // Gradient overlay for the contents
      gradient: 'rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.65) 100%)',

      // Use mouse movement to automatically open/close
      mouse: true,

      // Use touch swipe events to open/close
      touch: true
    });

    this.exportCsvService.exportCsv();

    this.dataService.reloadAll();

  }

}
