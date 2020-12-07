import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OpsMxForms } from 'projects/forms/src';
import { LogTemplateConfigService } from '../log-template-config.service';
import { LogTopicsService } from './log-topics.service';

@Component({
  selector: 'app-log-topics',
  templateUrl: './log-topics.component.html',
  styleUrls: ['./log-topics.component.less'],
  providers: [LogTopicsService]
})
export class LogTopicsComponent extends OpsMxForms implements OnInit {

  formObj: FormGroup = new FormGroup({});

  constructor(public service: LogTopicsService) {
    super();
  }

  ngOnInit(): void {
    this.service.initTopics();
    this.service.$parentDataLoaded.subscribe(loaded => {
      if(loaded) {
        this.formObj.addControl('logTopics', LogTemplateConfigService.LogTopicsForm);
      } else {
        this.service.initTopics();
      }
    });

  }

  formInvalid() {

  }

  formValid() {

  }

  addRow(event: any) {
    this.service.addRow();
  }

  deleteRow(event: any) {
    console.log(event);
  }

  onChange(event) {
    
  }

  get logTopicsForm() {
    return LogTemplateConfigService.LogTopicsForm;
  }

}
