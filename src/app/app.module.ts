import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { ProjectsComponent } from './projects/projects.component';
import { LogComponent } from './log/log.component';
import { ActivateComponent } from './activate/activate.component';

import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { BooleanPipe } from './boolean.pipe';
import { TopTasksComponent } from './top-tasks/top-tasks.component';
import { HeaderComponent } from './header/header.component';
import { EventDurationPipe } from './event-duration.pipe';
import { FormatMinutesPipe } from './format-minutes.pipe';
import { EditEventComponent } from './edit-event/edit-event.component';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SummaryComponent } from './summary/summary.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ElectronService } from './electron.service';
import { ApropriateService } from './apropriate.service';
import { ImportCsvService } from './import-csv.service';
import { MessagesService } from './messages.service';
import { MessagesComponent } from './messages/messages.component';
import { ConfigComponent } from './config/config.component';

const ROUTES: Route[] = [
  {
    path: 'log', component: LogComponent
  },
  {
    path: 'event/:id', component: EditEventComponent
  },
  { path: '', redirectTo: 'log', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    LogComponent,
    ActivateComponent,
    BooleanPipe,
    TopTasksComponent,
    HeaderComponent,
    EventDurationPipe,
    FormatMinutesPipe,
    EditEventComponent,
    SummaryComponent,
    MessagesComponent,
    ConfigComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(ROUTES),
    TimepickerModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [DataService,
    ElectronService,
    ApropriateService,
    ImportCsvService,
    MessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
