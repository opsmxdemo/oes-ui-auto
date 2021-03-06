import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, subscribeOn } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LogTemplateConfigService } from '../log-template-config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class LogProviderService extends LogTemplateConfigService {

  $logTemplateDataLoaded = new BehaviorSubject(false);

  params1 : any;
  logProviderParams : any;
  logAccountParams : any;
  formGroup : FormGroup;
  formControl : FormControl;
  autoBaseHelpParams : any;
  templateNameParams : any;
  namespaceParams : any;
  indexPatternParams : any;
  kibanaIndexParams : any;
  regularExpressionParams : any;
  responseKeyParams : any;
  senstivityParams : any;
  formObj = new FormGroup({
    formControl: new FormControl('')
  })
  color: ThemePalette = 'accent';
  autoBaselinechecked :boolean = false;
  autoBaseLinedisabled = false;
  regExpFilterChecked = false;
  regExpFilterDisabled = false;
  logSensitivityTypes = [
    { value : "high",name : "high"},
    { value : "medium",name : "medium"},
    { value : "low",name : "low"}
  ];
  logDataSources = [];
  isProviderParamsLoaded: boolean;
  listAccounts: any = [];
  listResponseKeys: any = [];
  reloadAccount: boolean;
  reloadResponseKey: boolean;

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) {
    super(http,router,toastr,environment);
  }

  initProviderComponent(){        
    if(LogTemplateConfigService.logTemplateData != undefined) {
      this.defineLogProviderForm();
      this.getDataScources().subscribe(resp => {
        setTimeout(() => {
          this.isProviderParamsLoaded = true;
        }, 100);        
      });        
      this.$logTemplateDataLoaded.next(true);
    } else {
      this.$logTemplateDataLoaded.next(false);
    }
  }

  getDataScources() {
    return forkJoin([this.getDataSourceList()]).pipe(
      map((resp: any) => { 
        let datasoucesList = resp[0].autopilotDataSources.filter(i => i.usage.includes('log'));
         datasoucesList.forEach(element => {
           let obj = { "value" : element.datasourceType, "name":element.displayName};
           this.logDataSources.push(obj);           
         });  
         this.initParamtersForComponents();      
        return resp;
      })
    )
  }

  defineLogProviderForm() {
    console.log("define log provider");
    console.log(LogTemplateConfigService.logTemplateData);
    console.log(LogTemplateConfigService.logProviderForm);
    LogTemplateConfigService.logProviderForm = new FormGroup({
      templateName : new FormControl(LogTemplateConfigService.logTemplateData.templateName),
      logProvider: new FormControl(LogTemplateConfigService.logTemplateData.monitoringProvider),
      logaccount : new FormControl(LogTemplateConfigService.logTemplateData.accountName),
      namespace  : new FormControl(LogTemplateConfigService.logTemplateData.namespace),
      indexPattern  : new FormControl(LogTemplateConfigService.logTemplateData.index),
      kibanaIndex  : new FormControl(LogTemplateConfigService.logTemplateData.kibanaIndex),
      responsekey  : new FormControl(LogTemplateConfigService.logTemplateData.regExResponseKey),
      regularExpression  : new FormControl(LogTemplateConfigService.logTemplateData.regularExpression),
      sensitivity  : new FormControl(LogTemplateConfigService.logTemplateData.sensitivity ? LogTemplateConfigService.logTemplateData.sensitivity : 'high'),
      regExFilter : new FormControl(LogTemplateConfigService.logTemplateData.regExFilter),
      autoBaseline : new FormControl(LogTemplateConfigService.logTemplateData.autoBaseline)
    });
    this.regExpFilterChecked = LogTemplateConfigService.logTemplateData.regExFilter;
  }

  
  initParamtersForComponents(){
    this.logProviderParams = {
      label: 'Provider',
      disabled: true,
      formControl: LogTemplateConfigService.logProviderForm.get('logProvider'),
      hidden: false,
      id: 'select-logProvider',
      required : true,
      options : this.logDataSources,
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    this.logAccountParams = {
      label: 'Log Account',
      disabled: false,
      formControl: LogTemplateConfigService.logProviderForm.get('logaccount'),
      hidden: false,
      id: 'select-logAccount',
      required : false,
      options : [
        { value : "value1",name : "name1"},
        { value : "value2",name : "name2"},
        { value : "value3",name : "name3"},
        { value : "value4",name : "name4"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    LogTemplateConfigService.logProviderForm.get('logProvider').setValue(LogTemplateConfigService.logTemplateData.monitoringProvider); 
    this.getAccountForProvdier().subscribe();
    //LogTemplateConfigService.logProviderForm.controls.logProvider.disable();

    this.autoBaseHelpParams = {
      title : "ML based learning of the baseline from historic analysis"
    };

    this.templateNameParams = {
      label: "Log Template Name",
      type: 'text',
      formControl: LogTemplateConfigService.logProviderForm.get('templateName'),
      hidden: false,
      id: 'input-templateName',
      required: true,
      placeholder: "Log Template Name",
      margin : "10px 0px"
    };   

    this.namespaceParams = {
      label: "Namespace",
      type: 'text',
      formControl: LogTemplateConfigService.logProviderForm.get('namespace'),
      hidden: false,
      id: 'input-namespace',
      required: false,
      placeholder: "Namespace",
      margin : "10px 0px"
    };

    this.indexPatternParams = {
      label: "Index Pattern",
      type: 'text',
      formControl: LogTemplateConfigService.logProviderForm.get('indexPattern'),
      hidden: false,
      id: 'input-indexpattern',
      required: false,
      placeholder: "Index pattern",
      margin : "10px 0px"
    };

    this.kibanaIndexParams = {
      label: "Kibana Default Index",
      type: 'text',
      formControl: LogTemplateConfigService.logProviderForm.get('kibanaIndex'),
      hidden: false,
      id: 'input-kibanaindex',
      required: false,
      placeholder: "Kibana default index",
      margin : "10px 0px"
    };

    this.regularExpressionParams = {
      label: "Regular Expression",
      type: 'text',
      formControl: LogTemplateConfigService.logProviderForm.get('regularExpression'),
      hidden: false,
      id: 'input-regularExpression',
      required: false,
      placeholder: "Regular Expression",
      margin : "10px 0px"
    };

    this.responseKeyParams = {
      label: 'Response Key',
      disabled: false,
      formControl: LogTemplateConfigService.logProviderForm.get('responsekey'),
      hidden: false,
      id: 'select-responsekey',
      required : false,
      options : [
        { value : "value1",name : "name1"},
        { value : "value2",name : "name2"},
        { value : "value3",name : "name3"},
        { value : "value4",name : "name4"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    this.senstivityParams = {
      label: 'Level of Sensitivity',
      disabled: false,
      formControl: LogTemplateConfigService.logProviderForm.get('sensitivity'),
      hidden: false,
      id: 'select-sensitivity',
      required : false,
      options : this.logSensitivityTypes,
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    this.autoBaselinechecked = LogTemplateConfigService.logTemplateData.autoBaseline

    this.autoBaseLinedisabled = this.getEditStatus();
    
    this.regExpFilterChecked = LogTemplateConfigService.logTemplateData.regExFilter;
    this.regExpFilterDisabled = false;

    if(this.getEditStatus()) {
      LogTemplateConfigService.logProviderForm.controls.templateName.disable();
      LogTemplateConfigService.logProviderForm.get('logProvider').disable();
      LogTemplateConfigService.logProviderForm.get('logaccount').disable();
    }
  }

  getDataSourceList() {
    return this.http.get<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/datasources');
  }

  getAccountForProvdier() {
    //api to get list of accounts
    return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials?datasourceType='+LogTemplateConfigService.logProviderForm.get('logProvider').value).pipe(map(resp => {
      this.loadAccounts(resp);
    }));
  }

  getResponseForElastic() {
    return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/logs/getDataSourceResponseKeys?accountName='+LogTemplateConfigService.logProviderForm.get('logaccount').value).pipe(map(resp => {
      this.loadResponseKey(resp);
    }));
  }

  loadAccounts(list: any) {
    let accountsDropdown = [];
    list.forEach(acc => {
      accountsDropdown.push({
        name: acc.name,
        value: acc.name
      })
    });
    this.listAccounts = accountsDropdown;

    this.logAccountParams = {
      label: 'Log Account',
      disabled: false,
      formControl: LogTemplateConfigService.logProviderForm.get('logaccount'),
      hidden: false,
      id: 'select-logAccount',
      required : false,
      options : accountsDropdown,
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };
    this.reloadAccount = false;
    setTimeout(() => {
      this.reloadAccount = true;
    }, 100);

    LogTemplateConfigService.logProviderForm.get('logaccount').setValue(LogTemplateConfigService.logTemplateData.accountName); 
    if(LogTemplateConfigService.logTemplateData.monitoringProvider == 'elasticsearch') {
      this.getResponseForElastic().subscribe();
    }
    
    // LogTemplateConfigService.logProviderForm.controls.logaccount.disable();

  }

  loadResponseKey(list: any) {
    let resposeKey = [];
    list.forEach(name => {
      resposeKey.push({
        name: name,
        value: name
      })
    });
    this.listResponseKeys = resposeKey;

    this.responseKeyParams = {
      label: 'Response Key',
      disabled: false,
      formControl: LogTemplateConfigService.logProviderForm.get('responsekey'),
      hidden: false,
      id: 'select-responsekey',
      required : false,
      options : resposeKey,
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };
    this.reloadResponseKey = false;
    setTimeout(() => {
      this.reloadResponseKey = true;
    }, 100);
    LogTemplateConfigService.logProviderForm.get('responsekey').setValue(LogTemplateConfigService.logTemplateData.regExResponseKey); 
  }

  getEditStatus() {
    return LogTemplateConfigService.editMode;
  }

  setAutoBaseLIne() {
    LogTemplateConfigService.logProviderForm.get('autoBaseline').setValue(this.autoBaselinechecked);
  }

  setRegExp() {
    LogTemplateConfigService.logProviderForm.get('regExFilter').setValue(this.regExpFilterChecked);
  }

}
