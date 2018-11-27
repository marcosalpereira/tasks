import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
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
import { BrowserService } from './browser.service';
import { ExportCsvService } from './export-csv.service';
import { EventDaoService } from './event-dao.service';
import { TaskDaoService } from './task-dao.service';
import { ProjectDaoService } from './project-dao.service';
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';
import { MaskDirective } from './mask.directive';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateValidatorDirective } from './date-validator.directive';
import { TimeValidatorDirective } from './time-validator.directive';
import { ChartsComponent } from './charts/charts.component';
import { ChartModule } from 'angular-highcharts';

// NOTE: foi usado 'pt' e nao 'pt-BR' isso pq 'pt' tem as definicoes do brasil
// portugal deveria usar 'pt-PT'
import { registerLocaleData } from '@angular/common';
import localesPt from '@angular/common/locales/pt';
registerLocaleData(localesPt);



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
    MaskDirective,
    DateValidatorDirective,
    TimeValidatorDirective,
    ChartsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(ROUTES),
    TimepickerModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ChartModule
  ],
  providers: [DataService,
    ElectronService,
    ApropriateService,
    ImportCsvService,
    MessagesService,
    BrowserService,
    ExportCsvService,
    EventDaoService,
    TaskDaoService,
    ProjectDaoService,
    ConfigService,
    StorageService,
    { provide: LOCALE_ID, useValue: 'pt' }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
