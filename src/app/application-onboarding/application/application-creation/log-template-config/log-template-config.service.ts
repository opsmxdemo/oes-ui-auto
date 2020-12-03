import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, subscribeOn } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class LogTemplateConfigService {

  applicationId: any;
  templateName: any;
  defaultLogTopics: any = [];
  topics: any = [];
  errorTopics: any = [];

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, private environment: AppConfigService) {}

  init(applicationId, templateName) {
    
    this.applicationId = applicationId;
    this.templateName = templateName;

    if(this.templateName) {
      return forkJoin([this.getTemplateDetails(), this.getDefaultLogTemplate]).pipe(
        map((resp: any) => {
          this.setTemplateData(resp[0]);
          this.setDefaultErrorTopics(resp[1])
          return resp;
        }));
    } else {
      return forkJoin([this.getDefaultLogTemplate()]).pipe(
        map((resp: any) => {
          this.setDefaultErrorTopics(resp[0])
        })
      )
    }
  }

  setTemplateData(resp) {
    this.errorTopics = resp[0].errorTopics;
  }

  setDefaultErrorTopics(resp) {
    this.defaultLogTopics = resp.logTopics
    this.topics = resp.topics;
  }

  getTemplateDetails() {
    return this.http.get<any>(this.environment.config.endPointUrl + `autopilot/api/v1/applications/${this.applicationId}/logTemplates/${this.templateName}`);
  }

  getDefaultLogTemplate() {
    return this.http.get<any>(this.environment.config.endPointUrl + `autopilot/api/v1/defaultLogTemplate`);
  }
}
