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
  public static LogTopicsForm: FormArray = new FormArray([]);
  

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) { }

  init(applicationId, templateName) {

    LogTemplateConfigService.applicationId = applicationId;
    LogTemplateConfigService.templateName = templateName;

    if (LogTemplateConfigService.templateName) {
      return forkJoin([this.getTemplateDetails(), this.getDefaultLogTemplate()]).pipe(
        map((resp: any) => {
          this.templateData(resp[0]);
          this.errorTopics(resp[1])
          return resp;
        }));
    } else {
      return forkJoin([this.getDefaultLogTemplate()]).pipe(
        map((resp: any) => {
          this.errorTopics(resp[0]);
          return resp;
        })
      )
    }
  }

  templateData(resp) {
    LogTemplateConfigService.errorTopicsList = resp.errorTopics;
  }

  errorTopics(resp) {
    if(!LogTemplateConfigService.templateName) {
      LogTemplateConfigService.errorTopicsList = resp.logTopics
    }
    LogTemplateConfigService.topicsList = resp.topics;
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
}
