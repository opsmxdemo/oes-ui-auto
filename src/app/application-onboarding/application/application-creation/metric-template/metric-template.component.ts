import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import * as fromFeature from '../../../store/feature.reducer';
import * as ApplicationActions from '../../store/application.actions';
import { Store } from '@ngrx/store';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as DataSourceActions from '../../../data-source/store/data-source.actions';

@Component({
  selector: 'app-metric-template',
  templateUrl: './metric-template.component.html',
  styleUrls: ['./metric-template.component.less']
})
export class MetricTemplateComponent implements OnInit, OnChanges{

  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  @Input() templateData: any;
  @Input() templateIndex: number;
  @Input() isEditMode: boolean;

  public editorOptions: JsonEditorOptions;
  public data: any = null;
  metricTemplateData = null;
  selectedTab = 'metric-apminfra';
  createMetricForm :FormGroup;
  apmProviders : any;
  infraProviders : any;
  autoDatasources : any;
  metricTemplateFormData = null;
  selectedCustomDataSource : any;
  customDataSourceAccounts : any;
  queryForm :FormGroup;
  riskDirectionList = ["Higher", "Lower", "HigherOrLower"];
  infraFormGroup:FormGroup;
  apmFormGroup : FormGroup;
  InfraDSAccounts :any;
  APMDSAccounts:any;
  selectedAPMDataSource : any;
  selectedINFRADataSource : any;
  APMApplicationForAccounts :any;

  constructor(private _formBuilder: FormBuilder,
    public store: Store<fromFeature.State>) { }

  ngOnChanges(changes: SimpleChanges){
    if(this.isEditMode && this.templateData !== null){
      this.data = this.templateData;
      this.selectedTab = 'metric-editor';
    }else{
      this.selectedTab = 'metric-apminfra';
      this.data = null;
    }
  }

  ngOnInit(): void {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    //this.selectedTab = 'metric-form'; //setting default tab selected as form

    this.store.dispatch(DataSourceActions.loadDatasourceList());
    this.store.select(fromFeature.selectDataSource).subscribe(
      (responseData) => {
        if(responseData.supportedDatasource != null){
          if(responseData.supportedDatasource.autopilotDataSources != null){
            this.autoDatasources = responseData.supportedDatasource.autopilotDataSources;
          }
        }
      }
    );

    this.store.select(fromFeature.selectApplication).subscribe(
      (responseData) => {
        if(responseData.customDSAccounts != null){
          this.customDataSourceAccounts = responseData.customDSAccounts;
        }
        if(responseData.APMDSAccounts != null){
          this.APMDSAccounts = responseData.APMDSAccounts;
        }
        if(responseData.InfraDSAccounts != null){
          this.InfraDSAccounts = responseData.InfraDSAccounts;
        }
        if(responseData.APMApplicationForAccounts != null){
          this.APMApplicationForAccounts = responseData.APMApplicationForAccounts;
        }
        
      }
    );
    
    //Form for custom metric
    this.createMetricForm = new FormGroup({
      templateName: new FormControl('',Validators.required),
      applicationName: new FormControl(),
      accountName : new FormControl(),
      data: new FormGroup({
        groups : new FormArray([])
      })
    });

    this.queryForm = new FormGroup({
      queryList: new FormArray([])
    });

    (<FormArray>this.queryForm.get('queryList')).push(
      new FormGroup({
        group : new FormControl(),
        name: new FormControl(),
        riskDirection: new FormControl('HigherOrLower'),
        customThresholdHigher : new FormControl(),
        customThresholdLower : new FormControl(),
        critical: new FormControl(false),
        watchlist : new FormControl(false),
        metricWeight: new FormControl('1')
      })
    );

    this.apmFormGroup = new FormGroup({
      templateName: new FormControl(),
      applicationName: new FormControl(),
      data: new FormGroup({
        groups : new FormArray([])
      })
    });

    this.infraFormGroup = new FormGroup({
      templateName: new FormControl(),
      applicationName: new FormControl(),
      data: new FormGroup({
        groups : new FormArray([])
      })
    });

    this.onClickTab(this.selectedTab);
    
  }

  // Below function is use to fetched json from json editor
  showJson(event = null){
    this.metricTemplateData = this.editor.get();
  }

  // Below function is use to save log template data on click of save btn
  Submitmetricdata(){
    if(this.isEditMode){
      this.store.dispatch(ApplicationActions.updatedMetricTemplate({metricTemplateData:this.metricTemplateData,index:this.templateIndex}));
    }else{
      this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.metricTemplateData}));
    }
    this.data = {};
  }

   // Below function is execute on click of Form or Editor tab.
   onClickTab(event){
    if(event.target.id === 'metric-form-tab'){
      this.selectedTab = 'metric-form';
    } else if(event.target.id === 'metric-editor-tab') {
      this.selectedTab = 'metric-editor';
    }else if(event.target.id === 'metric-apminfra-tab') {
      this.selectedTab = 'metric-apminfra';
    }
  }

  onChangeDatasource(datasource,type){
    if(type == 'apm'){
      this.selectedAPMDataSource = datasource; 
      this.store.dispatch(ApplicationActions.fetchAccountForAPMDataSource({datasource: datasource})); 
    }else if(type == 'custom'){
      this.selectedCustomDataSource = datasource;    
      this.store.dispatch(ApplicationActions.fetchAccountForCustomDataSource({datasource: this.selectedCustomDataSource}));   
    }else if(type== 'infra'){
      this.selectedINFRADataSource = datasource; 
      this.store.dispatch(ApplicationActions.fetchAccountForInfraDataSource({datasource: datasource})); 
    }
  }

  onChangeDSAccount(dsAccount,type){
    console.log("customDSAccount");
    console.log(dsAccount);
    this.store.dispatch(ApplicationActions.fetchApplicationForAPMAccounts({sourceType: this.selectedAPMDataSource, account: dsAccount})); 
    console.log("apmappli");
    console.log(this.APMApplicationForAccounts);
  }

  savemetrictemplate(){    
    this.metricTemplateFormData = {
      "templateName" : this.createMetricForm.value.templateName,
      "applicationName": "",
      "data": {
        "groups" : []
      }
    };
    let groupObj = {
      metrics: [],
      group : ""
    };
    this.queryForm.value.queryList.forEach(eachItem => {
      groupObj = {
        "group" : eachItem.group,
        "metrics": [
          {
            "metricType": 'ADVANCED',
            "name": eachItem.name,
            "accountName": this.createMetricForm.value.accountName,
            "customThresholdHigher": eachItem.customThresholdHigher,
            "customThresholdLower": eachItem.customThresholdLower,
            "riskDirection": eachItem.riskDirection,
            "critical": eachItem.critical,
            "watchlist": eachItem.watchlist,
            "metricWeight": Number(eachItem.metricWeight)                
          }      
        ]
      };      
      this.metricTemplateFormData.data.groups.push(groupObj);
    });
    //this.metricTemplateFormData.data.groups=groupObj;
    console.log(this.metricTemplateFormData);
    this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.metricTemplateFormData}));
  }

  addNewQuery(){
    (<FormArray>this.queryForm.get('queryList')).push(
      new FormGroup({
        group : new FormControl(),
        name: new FormControl(),
        riskDirection: new FormControl('HigherOrLower'),
        customThresholdHigher : new FormControl(),
        customThresholdLower : new FormControl(),
        critical: new FormControl(false),
        watchlist : new FormControl(false),
        metricWeight: new FormControl('1')
      })
    );
  }

  deleteQuery(query,index){
    this.queryForm.controls.queryList['controls'].splice(index,1);
    this.queryForm.value.queryList.splice(index, 1);
  }

  saveapminfra(){
    console.log("apm form");
    console.log(this.apmFormGroup);
    console.log("infra form");
    console.log(this.infraFormGroup);
  }


}
