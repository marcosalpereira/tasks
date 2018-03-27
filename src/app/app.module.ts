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
import { EventDurationPipe } from './event-duration.pipe';
import { FormatMinutesPipe } from './format-minutes.pipe';
import { EditEventComponent } from './edit-event/edit-event.component';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SummaryComponent } from './summary/summary.component';

const ROUTES: Route[] = [
  {
    path: 'summary', component: SummaryComponent
  },
  {
    path: 'log', component: LogComponent
  },
  {
    path: 'event/:id', component: EditEventComponent
  },
  { path: '', redirectTo: 'summary', pathMatch: 'full' }
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(ROUTES),
    BsDatepickerModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
