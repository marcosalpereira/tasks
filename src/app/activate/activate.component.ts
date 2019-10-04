import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Task } from '../task.model';
import { Project } from '../project.model';
import { DataService } from '../data.service';
import { NgForm, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  projectsChangedSub: Subscription;
  projects: Project[] = [];
  startTask = true;

  @ViewChild('form', {static: true}) form: NgForm;

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private appComponent: AppComponent) { }

    ngOnInit() {
      this.projects = this.dataService.getProjects();

      this.projectsChangedSub = this.dataService.projectsChanged$.subscribe(
        projects => {
          this.projects = projects;
          if (projects.length > 0) {
            const v = this.form.value;
            v['project'] = projects[projects.length - 1];
            this.form.setValue(v);
          }
        }
        );
      }

      ngOnDestroy() {
        this.projectsChangedSub.unsubscribe();
      }

      onSubmit() {
        const project: Project = this.form.value['project'];
        const taskName: string = this.form.value['taskName'];
        const code: number = +this.form.value['code'];
        const remarks = this.form.value['eventRemarks'];
        if (this.startTask) {
          this.dataService.startTask(project, code, taskName, remarks);
        } else {
          this.dataService.createTask(project, code, taskName);
        }
        this.appComponent.meny.close();
      }

  confirmNewProject(newProject) {
    this.modalRef.hide();
    this.dataService.addProject(newProject);
  }

  cancelNewProject() {
    this.modalRef.hide();
  }

  onClickNewProject(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

}
