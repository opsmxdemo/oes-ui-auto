import { Component, OnInit, ViewChild } from '@angular/core';
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
export class MetricTemplateComponent implements OnInit {

  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  public editorOptions: JsonEditorOptions;
  public data: any = null;
  metricTemplateData = null;
  selectedTab = '';
  createMetricForm :FormGroup;
  apmProviders : any;
  infraProviders : any;
  autoDatasources : any;
  metricTemplateFormData = null;
  selectedCustomDataSource : any;
  customDataSourceAccounts : any;
  queryForm :FormGroup;
  riskDirectionList = ["Higher", "Lower", "HigherOrLower"];

  constructor(private _formBuilder: FormBuilder,
    public store: Store<fromFeature.State>) { }

  ngOnInit(): void {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.selectedTab = 'metric-form'; //setting default tab selected as form

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
      }
    );
    
    this.createMetricForm = new FormGroup({
      templateName: new FormControl(),
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
        riskDirection: new FormControl(),
        customThresholdHigher : new FormControl(),
        customThresholdLower : new FormControl(),
        critical: new FormControl(),
        watchlist : new FormControl(),
        metricWeight: new FormControl()
      })
    );

    
  }

  // Below function is use to fetched json from json editor
  showJson(event = null){
    this.metricTemplateData = this.editor.get();
  }

  // Below function is use to save log template data on click of save btn
  Submitmetricdata(){
    this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.metricTemplateData}));
    this.data = {};
  }

   // Below function is execute on click of Form or Editor tab.
   onClickTab(event){
    if(event.target.id === 'metric-form-tab'){
      this.selectedTab = 'metric-form';
    } else if(event.target.id === 'metric-editor-tab') {
      this.selectedTab = 'metric-editor';
    }
  }

  onChangeDatasource(datasource){
    this.selectedCustomDataSource = datasource;    
    this.store.dispatch(ApplicationActions.fetchAccountForCustomDataSource({datasource: this.selectedCustomDataSource}));
    console.log("customDataSourceAccounts")
    console.log(this.customDataSourceAccounts);
  }

  onChangeCustomDSAccount(customDSAccount){
    console.log("customDSAccount");
    console.log(customDSAccount);
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
        riskDirection: new FormControl(),
        customThresholdHigher : new FormControl(),
        customThresholdLower : new FormControl(),
        critical: new FormControl(),
        watchlist : new FormControl(),
        metricWeight: new FormControl()
      })
    );
  }


}
