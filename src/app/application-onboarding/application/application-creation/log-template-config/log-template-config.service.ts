import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { flatMap, map, subscribeOn } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class LogTemplateConfigService {

  public static applicationId: any;
  public static templateName: any;
  public static defaultLogTopicsList : any = [];
  public static topicsList: any = [];
  public static errorTopicsList: any = [];
  public static tagList: any = [];
  public static LogTopicsForm: FormArray = new FormArray([]);
  public static dataScourceList : any = [];
  public static logTemplateData : any;
  public static logProviderForm : FormGroup = new FormGroup({});
  public static LogTagsForm: FormGroup;
  

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) { }

  init(applicationId, templateName) {

    LogTemplateConfigService.applicationId = applicationId;
    LogTemplateConfigService.templateName = templateName;
    LogTemplateConfigService.LogTopicsForm = new FormArray([]);
    LogTemplateConfigService.LogTagsForm = new FormGroup({});

    if (LogTemplateConfigService.templateName) {
      return forkJoin([this.getTemplateDetails(), this.getDefaultLogTemplate(), this.getDataSourceList()]).pipe(
        map((resp: any) => {
          this.templateData(resp[0]);
          this.errorTopics(resp[1]);
          this.dataScources(resp[2]);
          return resp;
        }));
    } else {
      return forkJoin([this.getDefaultLogTemplate(),this.getDataSourceList()]).pipe(
        map((resp: any) => {
          this.errorTopics(resp[0]);
          LogTemplateConfigService.logTemplateData = undefined;
          return resp;
        })
      )
    }
  }

  templateData(resp) {
    LogTemplateConfigService.logTemplateData = resp;
    LogTemplateConfigService.errorTopicsList = resp.errorTopics;
    LogTemplateConfigService.tagList = resp.tags || false;
  }

  errorTopics(resp) {
    if(!LogTemplateConfigService.templateName) {
      LogTemplateConfigService.errorTopicsList = resp.logTopics
    }
    LogTemplateConfigService.topicsList = resp.topics;
  }

  dataScources(resp) {
    LogTemplateConfigService.dataScourceList = resp.dataScourceList;
  }

  // defaultErrorTopics(resp) {
  //   this.defaultLogTopicsList = resp.logTopics
  //   this.topicsList = resp.topics;
  // }

  getTemplateDetails() {
    return this.http.get<any>(this.environment.config.endPointUrl + `autopilot/api/v1/applications/${LogTemplateConfigService.applicationId}/logTemplates/${LogTemplateConfigService.templateName}`);
  }

  getDefaultLogTemplate() {
    return this.http.get<any>(this.environment.config.endPointUrl + `autopilot/api/v1/defaultLogTemplate`);
  }

  getDataSourceList() {
    return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials');
  }

  submit() {
    // prepare the post and put object for saving a template
  }
}
