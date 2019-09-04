import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Task } from '../task.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BrowserService } from '../browser.service';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  task: Task;

  constructor(
    private dataService: DataService,
    private activeRoute: ActivatedRoute,
    private location: Location,
    public browserService: BrowserService
    ) { }

    goBack() {
      this.location.back();
    }


  ngOnInit() {
    const param = this.activeRoute.snapshot.paramMap;
    const id = +param.get('id');
    this.task = this.dataService.findTask(id);
  }

  onSubmit() {
    this.dataService.updateTask(this.task);
    this.dataService.reloadAll();
    this.goBack();
  }


}
