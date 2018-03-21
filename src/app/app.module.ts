import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProjectsComponent } from './projects/projects.component';
import { LogComponent } from './log/log.component';
import { RecentsComponent } from './recents/recents.component';
import { ActivateComponent } from './activate/activate.component';

import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    LogComponent,
    RecentsComponent,
    ActivateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
