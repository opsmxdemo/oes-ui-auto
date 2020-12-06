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
  clusterTagsList: any;
  defaultAlgo: any;
  scoringAlgoParams: any;
  clusterTagsListParams: any;
  tagForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    id: new FormControl('')
  })
  inputClusterTagParams: any = {
    label: "",
    type: 'text',
    formControl: this.tagForm.get('name'),
    hidden: false,
    id: 'input-tagName',
    required: true,
    placeholder: "Tag Name",
    margin: "10px 0px"
  };
  saveTagButtonParams: any = {
    text: "Save Tag",
    type: 'button',
    hidden: false,
    id: 'savebutton-tagName',
    color: 'blue'
  };
  cancelSaveTagButtonParams: any = {
    text: "Cancel",
    type: 'button',
    hidden: false,
    id: 'savebutton-tagName',
    color: 'blue'
  };
  formGridHeaders: any = {};
  reloadFormGrid: boolean;
  clusterTagsListOptions: any = [];
  clusterTagEnabled: boolean;

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
    return forkJoin([this.getScoringAlgorithms(), this.getTags()]);
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
      id: 'select-scroingAlgo',
      required: false,
      options: scoringAlgorithmsList,
      addOption: false,
      addOptionLabel: "",
      margin: "10px 0px"
    }
  }

  prepareTagListControlParams() {
    this.clusterTagsListOptions = [];
    this.tagList.forEach(tag => {
      this.clusterTagsListOptions.push({
        name: tag.name,
        value: tag.name
      })
    });
    this.clusterTagsListParams = {
      label: '',
      disabled: false,
      formControl: LogTemplateConfigService.LogTagsForm.get('clusterTagList'),
      hidden: false,
      id: 'select-taglist',
      required: false,
      options: this.clusterTagsListOptions,
      addOption: false,
      addOptionLabel: "",
      margin: "10px 0px"
    }
  }

  getTemplateTags() {
    if (LogTemplateConfigService.tagList && LogTemplateConfigService.tagList.length > 0) {
      this.saveTagList = LogTemplateConfigService.tagList;
      this.clusterTagEnabled = true;
      this.defineTagFormArray();
      return;
    }
    if (LogTemplateConfigService.tagList && LogTemplateConfigService.tagList.length == 0) {
      setTimeout(() => {
        this.getTemplateTags();
      }, 10);
    } else {
      this.saveTagList = [];
      this.clusterTagEnabled = false;
      this.defineTagFormArray();
    }
  }

  defineLogTagForm() {
    LogTemplateConfigService.LogTagsForm = new FormGroup({
      'scoringAlgorithm': new FormControl(''),
      'clusterTagList': new FormControl('')
    });
  }

  defineTagFormArray() {
    LogTemplateConfigService.LogTagsForm.addControl('tags', new FormArray([]));
    if (this.saveTagList.length > 0) {
      this.saveTagList.forEach(tag => {
        (<FormArray>LogTemplateConfigService.LogTagsForm.get('tags')).controls.push(new FormGroup({
          'string': new FormControl(tag.string, [Validators.required]),
          'tag': new FormControl(tag.tag, [Validators.required]),
          'id': new FormControl(tag.id)
        }));
      });
    }
  }

  getScoringAlgorithms() {
    return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/scoring-algorithms').pipe(map((resp: any) => {
      this.scoringAlgorithmsList = resp.algorithms;
      this.defaultAlgo = resp.defaultValue
      this.prepareScoringAlgoControlParams();
      return resp;
    }));
  }

  getTags() {
    return this.http.get<any>(this.environment.config.endPointUrl + `autopilot/api/v1/applications/${LogTemplateConfigService.applicationId}/tags`).pipe(map((resp: any) => {
      this.tagList = resp;
      this.prepareTagListControlParams();
      this.setColHeaders();
      return resp;
    }));
  }

  setColHeaders() {
    let col1Header = {
      headerName: 'Cluster Tag String',
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
      width: 70
    };

    let col2Header = {
      headerName: 'Cluster Tag',
      fieldOptions: {
        field: 'select',
        label: '',
        disabled: false,
        hidden: false,
        id: 'tag',
        required: false,
        options: this.clusterTagsListOptions,
        addOption: false,
        addOptionLabel: ""
      },
      tooltip: '',
      width: 25
    };

    this.formGridHeaders.formGridHeader = [col1Header, col2Header];
    this.formGridHeaders.addRow = true;
    this.formGridHeaders.deleteRow = true;
    this.reloadFormGrid = false;
    setTimeout(() => {
      this.reloadFormGrid = true;
    }, 100);
  }

  saveClusterTagName() {
    let tagDetails = this.tagForm.value;
    return this.http.post<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/' + LogTemplateConfigService.applicationId + '/tags', tagDetails);
  }

  updateClusterTagName() {
    let tagId = this.tagForm.get('id').value;
    let tagDetails = this.tagForm.value;
    return this.http.put<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+LogTemplateConfigService.applicationId+'/tags/' + tagId, tagDetails);
  }

  addFormRow() {
    (<FormArray>LogTemplateConfigService.LogTagsForm.get('tags')).controls.splice(0, 0, new FormGroup({
      'string': new FormControl('', [Validators.required]),
      'tag': new FormControl('', [Validators.required]),
      'id': new FormControl('')
    }));
  }

  updateFormArrayVal(tagData) {
    let control = (<FormArray>LogTemplateConfigService.LogTagsForm.get('tags')).controls.find(control => control.get('tag').value == tagData.name);
    control.get('tag').setValue(this.tagForm.controls.name.value);
  }
}
