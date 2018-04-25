import { Component, OnInit } from '@angular/core';
import { ChildProcessService } from 'ngx-childprocess';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private childProcessService: ChildProcessService) {}


  ngOnInit() {
  }


  doIt() {
    this.childProcessService.childProcess.execFileSync('gedit', ['/home/54706424372/git/tasks/src/app/header/header.component.ts'], []);
  }
}
