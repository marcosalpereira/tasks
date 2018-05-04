import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../electron.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public electronService: ElectronService) { }

  doIt() {
    const file = '/home/54706424372/tmp/t1.txt';
    const linha = 'linha:' + new Date();
    const out = this.electronService.fs.writeFileSync(file, linha);
    this.electronService.childProcess.exec('gedit ' + file);
  }

   // this.childProcessService.childProcess.execFileSync('gedit', ['/home/54706424372/git/tasks/src/app/header/header.component.ts'], []);
}
