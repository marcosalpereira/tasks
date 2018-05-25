import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Task } from '../task.model';
import { Project } from '../project.model';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  projectsChanged$: Subscription;
  projects: Project[] = [];

  @ViewChild('form') form: NgForm;

  constructor(
    private dataService: DataService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.projects = this.dataService.getProjects();

    this.projectsChanged$ = this.dataService.projectsChanged$.subscribe(
      projects => {
        this.projects = projects;
        const v = this.form.value;
        v['project'] = projects[projects.length - 1];
        this.form.setValue(v);
      }
    );
  }

  ngOnDestroy() {
    this.projectsChanged$.unsubscribe();
  }

  onSubmit() {
    const project: Project = this.form.value['project'];
    const taskName: string = this.form.value['taskName'];
    const taskId: number = +this.form.value['taskId'];
    const remarks = this.form.value['eventRemarks'];
    this.dataService.startTask(project, taskId, taskName, remarks);
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
