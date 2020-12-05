import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { flatMap, map, subscribeOn } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LogTemplateConfigComponent } from '../log-template-config.component';
import { LogTemplateConfigService } from '../log-template-config.service';

@Injectable({
  providedIn: 'root'
})
export class LogTagService extends LogTemplateConfigService {

  tagList: any = [];
  saveTagList: any = [];
  scoringAlgorithmsList: any;
  defaultAlgo: any;
  scoringAlgoParams: any;

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) {
    super(http, router, toastr, environment);
  }

  initTags() {
    this.defineLogTagForm();
    this.getTemplateTags();
    return this.getScoringTagsList().pipe(map(resp => {
      return resp;
    }));
  }

  getScoringTagsList() {
    return forkJoin([this.getScoringAlgorithms(), this.getTags()]).pipe(map((resp: any) => {
      this.tagList = resp[1];
      this.scoringAlgorithmsList = resp[0].algorithms;
      this.defaultAlgo = resp[0].defaultValue
      this.prepareScoringAlgoControlParams();
    }));
  }

  prepareScoringAlgoControlParams() {
    let scoringAlgorithmsList = [];
    this.scoringAlgorithmsList.forEach(algo => {
      scoringAlgorithmsList.push({
        name: algo,
        value: algo
      })
    });
    let scoringAlgoValue = LogTemplateConfigService.logTemplateData.scoringAlgorithm || this.defaultAlgo;
    LogTemplateConfigService.LogTagsForm.controls.scoringAlgorithm.setValue(scoringAlgoValue)
    this.scoringAlgoParams = {
      label: 'Scoring Algorithm',
      disabled: false,
      formControl: LogTemplateConfigService.LogTagsForm.get('scoringAlgorithm'),
      hidden: false,
      id: 'select-logProvider',
      required : true,
      options : scoringAlgorithmsList,
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    }
  }

  getTemplateTags() {
    if (LogTemplateConfigService.tagList && LogTemplateConfigService.tagList.length > 0) {
      this.saveTagList = LogTemplateConfigService.tagList;
      this.defineTagFormArray();
      return;
    }
    if (LogTemplateConfigService.tagList && LogTemplateConfigService.tagList.length == 0) {
      setTimeout(() => {
        this.getTemplateTags();
      }, 10);
    } else {
      this.saveTagList = [];
      this.defineTagFormArray();
    }
  }

  defineLogTagForm() {
    LogTemplateConfigService.LogTagsForm = new FormGroup({
      'scoringAlgorithm': new FormControl(''),
      'enableClusterTag': new FormControl(false),
      'clusterTagList': new FormControl('')
    })
  }

  defineTagFormArray() {
    LogTemplateConfigService.LogTagsForm.addControl('tags', new FormArray([]));
    if (this.saveTagList.length > 0) {
      this.saveTagList.forEach(tag => {
        (<FormArray>LogTemplateConfigService.LogTagsForm.get('tags')).controls.push(new FormGroup({
          'id': new FormControl(tag.id),
          'string': new FormControl(tag.string, [Validators.required]),
          'tag': new FormControl(tag.tag, [Validators.required])
          // 'dummyString': new FormControl(tag.string)
        }));
      });
    }
  }

  getScoringAlgorithms() {
    return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/scoring-algorithms');
  }

  getTags() {
    return this.http.get<any>(this.environment.config.endPointUrl + `autopilot/api/v1/applications/${LogTemplateConfigService.applicationId}/tags`);
  }
}
