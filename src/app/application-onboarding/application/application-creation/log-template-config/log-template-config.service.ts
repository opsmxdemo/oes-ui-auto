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
  public static defaultLogTopicsList: any = [];
  public static topicsList: any = [];
  public static errorTopicsList: any = [];
  public static tagList: any = [];
  public static LogTopicsForm: FormArray = new FormArray([]);
  public static logTemplateData: any;
  public static logProviderForm: FormGroup = new FormGroup({});
  public static LogTagsForm: FormGroup;
  public static editMode: boolean;


  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) { }

  init(applicationId, templateName) {

    LogTemplateConfigService.applicationId = applicationId;
    LogTemplateConfigService.templateName = templateName;
    LogTemplateConfigService.LogTopicsForm = new FormArray([]);
    LogTemplateConfigService.LogTagsForm = new FormGroup({});

    if (LogTemplateConfigService.templateName) {
      LogTemplateConfigService.editMode = true;
      return forkJoin([this.getTemplateDetails(), this.getDefaultLogTemplate()]).pipe(
        map((resp: any) => {
          this.templateData(resp[0]);
          this.errorTopics(resp[1]);
          return resp;
        }));
    } else {
      LogTemplateConfigService.editMode = false;

      return forkJoin([this.getDefaultLogTemplate()]).pipe(
        map((resp: any) => {
          let mockObj = {
            "kibanaIndex": "",
            "accountName": "",
            "regularExpression": "",
            "configuration": "",
            "autoBaseline": false,
            "monitoringProvider": "",
            "index": "",
            "templateId": 0,
            "tags": false,
            "errorTopics": [],
            "templateName": "",
            "scoringAlgorithm": "",
            "regExResponseKey": "",
            "namespace": null,
            "sensitivity": "",
            "regExFilter": false,
            "applicationName": ""
          };
          this.errorTopics(resp[0]);
          this.templateData(mockObj);
          // LogTemplateConfigService.logTemplateData = undefined;
          return resp;
        })
      )
    }
  }

  templateData(resp) {
    LogTemplateConfigService.logTemplateData = resp;
    if (LogTemplateConfigService.templateName) {
      LogTemplateConfigService.errorTopicsList = resp.errorTopics;
    }
    LogTemplateConfigService.tagList = resp.tags || false;
  }

  errorTopics(resp) {
    if (!LogTemplateConfigService.templateName) {
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

  submit() {
    let putObj = {
      "templateName": LogTemplateConfigService.logProviderForm.get('templateName').value,
      "monitoringProvider": LogTemplateConfigService.logProviderForm.get('logProvider').value,
      "scoringAlgorithm": LogTemplateConfigService.LogTagsForm.get('scoringAlgorithm').value,
      "accountName": LogTemplateConfigService.logProviderForm.get('logaccount').value,
      "index": LogTemplateConfigService.logProviderForm.get('indexPattern').value,
      "kibanaIndex": LogTemplateConfigService.logProviderForm.get('kibanaIndex').value,
      "regExFilter": LogTemplateConfigService.logProviderForm.get('regExFilter').value,
      "regExResponseKey": LogTemplateConfigService.logProviderForm.get('responsekey').value,
      "regularExpression": LogTemplateConfigService.logProviderForm.get('regularExpression').value,
      "autoBaseline": LogTemplateConfigService.logProviderForm.get('autoBaseline').value,
      "sensitivity": LogTemplateConfigService.logProviderForm.get('sensitivity').value,
      "tags": (<FormArray>LogTemplateConfigService.LogTagsForm.get('tags')).getRawValue(),
      "errorTopics": LogTemplateConfigService.LogTopicsForm.getRawValue(),
      "applicationId": LogTemplateConfigService.applicationId,
      "applicationName": "rmanager",
      "emailId": "vasantha@opsmx.io"
    }
    console.log(putObj);
    if (LogTemplateConfigService.editMode) {
      this.updateTemplate(putObj).subscribe();
    } else {
      this.createTemplate(putObj).subscribe();
    }
  }

  createTemplate(data) {
    return this.http.post<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+LogTemplateConfigService.applicationId+'/logTemplates', data)
  }

  updateTemplate(data) {
    return this.http.put<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/' + LogTemplateConfigService.applicationId + '/logTemplates/' + data.templateName, data);
  }
}
