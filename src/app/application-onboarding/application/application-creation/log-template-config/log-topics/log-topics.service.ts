import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LogTemplateConfigService } from '../log-template-config.service';

@Injectable({
  providedIn: 'root'
})
export class LogTopicsService extends LogTemplateConfigService {
  formGridHeaders: any = {};topicList: any[];
  $parentDataLoaded = new BehaviorSubject(false);

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) {
    super(http, router, toastr, environment)
  }

  initTopics() {
    if(LogTemplateConfigService.errorTopicsList && LogTemplateConfigService.errorTopicsList.length > 0 && LogTemplateConfigService.topicsList.length) {
      this.defineLogTopicsForm();
      this.formatTopics();
      this.setColHeaders();
      this.$parentDataLoaded.next(true);
    } else {
      this.$parentDataLoaded.next(false);
    }
    
  }

  defineLogTopicsForm() {
    LogTemplateConfigService.errorTopicsList.forEach((topic, i) => {
      let rowField = [];
      LogTemplateConfigService.LogTopicsForm.controls.push(new FormGroup({
        string: new FormControl(topic.string, [Validators.required]),
        topic: new FormControl(topic.topic, [Validators.required]),
        type: new FormControl({value: topic.type, disabled: true}, [Validators.required])
      }));
    });
    console.log(LogTemplateConfigService.LogTopicsForm);
  }

  formatTopics() {
    this.topicList = [];
    LogTemplateConfigService.topicsList.forEach(topic => {
      this.topicList.push({
        value : topic,
        name : topic
      })
    });
  }

  setColHeaders() {
    let col1Header = {
      headerName: 'String Pattern',
      fieldOptions: {
        field: 'input',
        label: '',
        type: 'text',
        hidden: false,
        id: 'string',
        required: false,
        placeholder: '',
        disabled: false
      },
      tooltip: '',
      width: 60
    }

    let col2Header = {
      headerName: 'Characterization Topic',
      fieldOptions: {
        field: 'select',
        label: '',
        disabled: false,
        hidden: false,
        id: 'chType',
        required : false,
        options : this.topicList,
        addOption : false,
        addOptionLabel : ""
      },
      tooltip: '',
      width: 20
    }

    let col3Header = {
      headerName: 'Type',
      fieldOptions: {
        field: 'input',
        label: '',
        type: 'text',
        hidden: false,
        id: 'type',
        required: false,
        placeholder: '',
        disabled: true
      },
      tooltip: '',
      width: 15
    }

    this.formGridHeaders.formGridHeader = [col1Header, col2Header, col3Header];
    this.formGridHeaders.addRow = true;
    this.formGridHeaders.deleteRow = true;
  }

  addRow() {
    LogTemplateConfigService.LogTopicsForm.controls.splice(0, 0, new FormGroup({
      string: new FormControl('', [Validators.required]),
      topic: new FormControl('', [Validators.required]),
      type: new FormControl({value: 'custom', disabled: true}, [Validators.required])
    }));
  }

}
