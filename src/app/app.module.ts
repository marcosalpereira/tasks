import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProjectsComponent } from './projects/projects.component';
import { LogComponent } from './log/log.component';
import { ActivateComponent } from './activate/activate.component';

import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { BooleanPipe } from './boolean.pipe';
import { TopTasksComponent } from './top-tasks/top-tasks.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    LogComponent,
    ActivateComponent,
    BooleanPipe,
    TopTasksComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
