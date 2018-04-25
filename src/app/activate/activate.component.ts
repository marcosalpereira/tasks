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
  projectAddedSub: Subscription;
  projects: Project[] = [];

  @ViewChild('form') form: NgForm;

  constructor(
    private dataService: DataService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.projects = this.dataService.getProjects();

    this.projectAddedSub = this.dataService.projectAdded$.subscribe(
      project => {
        this.projects.push(project);
        this.projects = this.projects.slice();
        const v = this.form.value;
        v['project'] = project;
        this.form.setValue(v);
      }
    );
  }

  ngOnDestroy() {
    this.projectAddedSub.unsubscribe();
  }

  onSubmit() {
    const project: Project = this.form.value['project'];
    const taskName: string = this.form.value['taskName'];
    const taskId: number = +this.form.value['taskId'];
    const task: Task = new Task(project, taskId, taskName);
    const remarks = this.form.value['eventRemarks'];
    this.dataService.startTask(task, remarks);
  }

  confirmNewProject(newProject) {
    this.modalRef.hide();
    this.dataService.addProject(new Project(newProject));
  }

  cancelNewProject() {
    this.modalRef.hide();
  }

  onClickNewProject(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

}
