import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import * as fromFeature from '../../../store/feature.reducer';
import * as ApplicationActions from '../../store/application.actions';
import { Store } from '@ngrx/store';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as DataSourceActions from '../../../data-source/store/data-source.actions';
import { MatHorizontalStepper } from '@angular/material/stepper';

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
  @ViewChild('stepper') stepper: MatHorizontalStepper;

  @Input() metricTemplate:boolean;

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
  INFRACookbook:any;
  INFRACooknookGroups : any;
  apmcookbookForm :FormGroup;
  APMCookbook :any;
  APMCookbookGroups :any;
  infracookbookForm : FormGroup;
  selectedAPMDSAccount :any;
  apminfraTemplate = null;
  metricConfigForm : FormGroup;
  selectAllAPM:boolean=true

  constructor(private _formBuilder: FormBuilder,
    public store: Store<fromFeature.State>) { }

  ngOnChanges(changes: SimpleChanges){
    if(this.isEditMode && this.templateData != null){
      this.data = this.templateData;
      this.selectedTab = 'metric-editor';
    }else{
      this.selectedTab = 'metric-apminfra';
      this.data = null;
    }
    if(this.metricTemplate != undefined){
      this.intializeForms();
      this.selectedTab = 'metric-apminfra';
      this.clearFormData();
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

    this.store.select(fromFeature.selectMetricTemplate).subscribe(
      (responseData) => {
        if(responseData.customDSAccounts != null && responseData.isLoadedAccountForCustomDataSource){
          this.store.dispatch(ApplicationActions.loadedAccountForCustomDataSource());
          this.customDataSourceAccounts = responseData.customDSAccounts;
        }
        if(responseData.APMDSAccounts != null && responseData.isLoadedAccountForAPMDataSource){
          this.store.dispatch(ApplicationActions.loadedAccountForAPMDataSource());
          this.APMDSAccounts = responseData.APMDSAccounts;
        }
        if(responseData.InfraDSAccounts != null && responseData.isLoadedAccountForInfraDataScource){
          this.store.dispatch(ApplicationActions.loadedAccountForInfraDataSource());
          this.InfraDSAccounts = responseData.InfraDSAccounts;
        }
        if(responseData.APMApplicationForAccounts != null && responseData.isLoadedApplicationForAPM){
          this.store.dispatch(ApplicationActions.loadedApplicationForAPMAccounts());
          this.APMApplicationForAccounts = responseData.APMApplicationForAccounts;
        }
        if(responseData.INFRACookbook != null && responseData.isLoadedInfraCookbook){
          this.store.dispatch(ApplicationActions.loadedInfraGenerateCookbook());
          this.INFRACookbook = responseData.INFRACookbook;
          if(this.INFRACookbook != null){  
            if(this.INFRACookbook.data != undefined){                               
              if(this.INFRACookbook.data.groups.length > 0){
                this.INFRACooknookGroups = this.INFRACookbook.data.groups;
                //code to remove all items from the Form before pushing
                const control = <FormArray>this.infracookbookForm.controls['cookbooklist'];
                    for(let i = control.length-1; i >= 0; i--) {
                        control.removeAt(i)
                }
                this.INFRACooknookGroups.forEach((cookbook,cookbookindex) => {
                  (<FormArray>this.infracookbookForm.get('cookbooklist')).push(
                    new FormGroup({
                      group: new FormControl(cookbook.group),
                      averageWeight : new FormControl(),
                      isSelectedToSave :new FormControl(true),
                      metrics: new FormArray([])
                    })
                  ); 
                  
                  //populating metrics array
                  cookbook.metrics.forEach((metricObj, metricIndex) => {
                    const cookbookArray = this.infracookbookForm.get('cookbooklist') as FormArray;
                    const metricArray = cookbookArray.at(cookbookindex).get('metrics') as FormArray;
                    metricArray.push(
                      new FormGroup({
                        name: new FormControl(metricObj.name),                       
                        accountName : new FormControl(metricObj.accountName),
                        aggregator : new FormControl(metricObj.aggregator),
                        displayUnit : new FormControl(metricObj.displayUnit),
                        metricType : new FormControl(metricObj.metricType),
                        aggregatorTimeInterval: new FormControl(metricObj.aggregatorTimeInterval),
                        aggregatorTimeIntervalUnit : new FormControl(metricObj.aggregatorTimeIntervalUnit),
                        duration: new FormControl(metricObj.duration),
                        riskDirection : new FormControl(metricObj.riskDirection),
                        critical : new FormControl(false),
                        watchlist : new FormControl(false)                    
                      })
                    )
                  })
                 });
              }
             }         
            }
        }
        if(responseData.APMCookbook != null && responseData.isLoadedAPMCookbook){
          this.store.dispatch(ApplicationActions.loadedAPMGenerateCookbook());
          this.APMCookbook = responseData.APMCookbook;
          if(this.APMCookbook != null){    
            if(this.APMCookbook.data != undefined){               
                if(this.APMCookbook.data.groups.length > 0){
                  this.APMCookbookGroups = this.APMCookbook.data.groups;
                  //code to remove all items from the Form before pushing
                  const control = <FormArray>this.apmcookbookForm.controls['cookbooklist'];
                      for(let i = control.length-1; i >= 0; i--) {
                          control.removeAt(i)
                  }
                  this.APMCookbookGroups.forEach((cookbook,cookbookindex) => {
                    (<FormArray>this.apmcookbookForm.get('cookbooklist')).push(
                      new FormGroup({
                        group: new FormControl(cookbook.group),
                        isSelectedToSave :new FormControl(true),
                        metrics: new FormArray([])
                      })
                    ); 
    
                    //populating metrics array
                    cookbook.metrics.forEach((metricObj, metricIndex) => {
                      const cookbookArray = this.apmcookbookForm.get('cookbooklist') as FormArray;
                      const metricArray = cookbookArray.at(cookbookindex).get('metrics') as FormArray;
                      metricArray.push(
                        new FormGroup({
                          name: new FormControl(metricObj.name),                      
                          accountName : new FormControl(metricObj.accountName),
                          aggregator : new FormControl(metricObj.aggregator),
                          displayUnit : new FormControl(metricObj.displayUnit),
                          label : new FormControl (metricObj.label),
                          metricType : new FormControl(metricObj.metricType),
                          aggregatorTimeIntervalUnit: new FormControl(metricObj.aggregatorTimeIntervalUnit),
                          riskDirection : new FormControl(metricObj.riskDirection),
                          critical : new FormControl(false),
                          watchlist : new FormControl(false)
                        })
                      )
                    })                               
                   });
                  }
                }
              }
        }
      }
    );
    
    this.intializeForms();

    this.onClickTab(this.selectedTab);
    
  }

  intializeForms(){
     //Form for custom metric
     this.createMetricForm = new FormGroup({
      templateName: new FormControl('',Validators.required),
      applicationName: new FormControl(),
      accountName : new FormControl(),
      dataSource : new FormControl(),
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
      templateName: new FormControl('',Validators.required),
      apmProvider :new FormControl(),
      apmProviderAccount: new FormControl(),
      applicationName: new FormControl(),
      apmApplication: new FormControl(),
      data: new FormGroup({
        groups : new FormArray([])
      })
    });


    this.infraFormGroup = new FormGroup({
      templateName: new FormControl(),
      infraProvider :new FormControl(),
      applicationName: new FormControl(),
      data: new FormGroup({
        groups : new FormArray([])
      })
    });

    this.infracookbookForm = new FormGroup({
      cookbooklist: new FormArray([
        new FormGroup({
          group : new FormControl(),
          isSelectedToSave : new FormControl(),
          metrics: new FormArray([
            new FormGroup({
              name: new FormControl(),                      
              accountName : new FormControl(),
              aggregator : new FormControl(),
              displayUnit : new FormControl(),
              metricType : new FormControl(),
              aggregatorTimeInterval: new FormControl(),
              aggregatorTimeIntervalUnit : new FormControl(),
              duration: new FormControl(),
              riskDirection : new FormControl(),
              critical : new FormControl(false),
              watchlist : new FormControl(false)
            })
          ])
        })
      ])
    });
    


    this.apmcookbookForm = new FormGroup({
      cookbooklist: new FormArray([
        new FormGroup({
          group : new FormControl(),
          isSelectedToSave : new FormControl(),
          metrics: new FormArray([
            new FormGroup({
              name: new FormControl(),                      
              accountName : new FormControl(),
              aggregator : new FormControl(),
              displayUnit : new FormControl(),
              label : new FormControl(),
              metricType : new FormControl(),
              aggregatorTimeIntervalUnit: new FormControl(),
              riskDirection : new FormControl(),
              critical : new FormControl(false),
              watchlist : new FormControl(false)
            })
          ])
        })
      ])
    });

    //code to remove all items from the Form before pushing
    const control = <FormArray>this.apmcookbookForm.controls['cookbooklist'];
    for(let i = control.length-1; i >= 0; i--) {
            control.removeAt(i)
    }

    this.metricConfigForm = new FormGroup({
      isNormalize : new FormControl(false),
      threshold : new FormControl(false)
    });
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
    if(event === 'metric-form-tab'){
      this.selectedTab = 'metric-form';
    } else if(event === 'metric-editor-tab') {
      this.selectedTab = 'metric-editor';
    }else if(event === 'metric-apminfra-tab') {
      this.selectedTab = 'metric-apminfra';
    }
  }

  onChangeDatasource(datasource,type){
    //this.APMDSAccounts = "";
    if(type == 'apm'){
      this.APMDSAccounts = [];
      this.selectedAPMDataSource = datasource; 
      this.store.dispatch(ApplicationActions.fetchAccountForAPMDataSource({datasource: datasource})); 
    }else if(type == 'custom'){
      this.customDataSourceAccounts =[];
      this.selectedCustomDataSource = datasource;    
      this.store.dispatch(ApplicationActions.fetchAccountForCustomDataSource({datasource: this.selectedCustomDataSource}));   
    }else if(type== 'infra'){
      this.InfraDSAccounts = [];
      this.selectedINFRADataSource = datasource; 
      this.store.dispatch(ApplicationActions.fetchAccountForInfraDataSource({datasource: datasource})); 
    }
  }

  onChangeDSAccount(dsAccount,type){ 
    if(type == 'apm'){
      this.selectedAPMDSAccount = dsAccount;
      this.APMApplicationForAccounts = [];
      this.store.dispatch(ApplicationActions.fetchApplicationForAPMAccounts({sourceType: this.selectedAPMDataSource, account: dsAccount}));
    }else if(type== 'infra'){
      this.INFRACookbook = {};
      this.store.dispatch(ApplicationActions.fetchInfraGenerateCookbook({account:dsAccount,applicationName:dsAccount,metricType:'INFRA',sourceType:this.selectedINFRADataSource,templateName:this.apmFormGroup.value.templateName}));          
    }
     
  }

  onChangeAccountForDS(dsApplication, type){
    if(type == 'apm'){
      this.APMCookbook = {};
      this.store.dispatch(ApplicationActions.fetchAPMGenerateCookbook({account:this.selectedAPMDSAccount,applicationName:dsApplication,metricType:'APM',sourceType:this.selectedAPMDataSource,templateName:this.apmFormGroup.value.templateName}));                    
    }
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
    this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.metricTemplateFormData}));
    this.clearFormData();
    
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
          
    this.apminfraTemplate = {
      "templateName" : this.apmFormGroup.value.templateName,
      "applicationName": this.apmFormGroup.value.apmApplication != null ? this.apmFormGroup.value.apmApplication : this.infraFormGroup.value.applicationName,
      "data": {
        "groups" : [],
        "isNormalize": this.metricConfigForm.value.isNormalize,
        "percent_diff_threshold" : (this.metricConfigForm.value.threshold ? "easy" :"hard")
      }
    };  
    
    var cookbookArray = [];
    cookbookArray = this.apmcookbookForm.value.cookbooklist.concat(this.infracookbookForm.value.cookbooklist)
    this.apminfraTemplate.data.groups =cookbookArray;
    this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.apminfraTemplate}));
    this.clearFormData();
  }

  clearFormData(){
    this.createMetricForm.reset();
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
    this.apmFormGroup.reset();
    this.infraFormGroup.reset();

    this.infracookbookForm = new FormGroup({
      cookbooklist: new FormArray([
        // new FormGroup({
        //   group : new FormControl(),
        //   isSelectedToSave : new FormControl(),
        //   metrics: new FormArray([
        //     new FormGroup({
        //       name: new FormControl(),                      
        //       accountName : new FormControl(),
        //       aggregator : new FormControl(),
        //       displayUnit : new FormControl(),
        //       metricType : new FormControl(),
        //       aggregatorTimeInterval: new FormControl(),
        //       aggregatorTimeIntervalUnit : new FormControl(),
        //       duration: new FormControl(),
        //       riskDirection : new FormControl(),
        //       critical : new FormControl(),
        //       watchlist : new FormControl()
        //     })
        //   ])
        //})
      ])
    });


    this.apmcookbookForm = new FormGroup({
      cookbooklist: new FormArray([
        // new FormGroup({
        //   group : new FormControl(),
        //   isSelectedToSave : new FormControl(),
        //   metrics: new FormArray([
        //     new FormGroup({
        //       name: new FormControl(),                      
        //       accountName : new FormControl(),
        //       aggregator : new FormControl(),
        //       displayUnit : new FormControl(),
        //       label : new FormControl(),
        //       metricType : new FormControl(),
        //       aggregatorTimeIntervalUnit: new FormControl(),
        //       riskDirection : new FormControl(),
        //       critical : new FormControl(),
        //       watchlist : new FormControl()
        //     })
        //   ])
        // })
      ])
    });

    this.metricConfigForm = new FormGroup({
      isNormalize : new FormControl(false),
      threshold : new FormControl(false)
    });

    if(this.stepper != undefined){
      this.stepper.reset();
    }   
  }

  onselectAllAPM(event){
    var CheckedValue = event.target.checked
    if(CheckedValue==true)
    {
      for(let i=0;i<this.apmcookbookForm.value.cookbooklist.length;i++)
      {
        this.apmcookbookForm.value.cookbooklist[i].isSelectedToSave=true
      
      }
    }
    else if(CheckedValue==false){
      for(let i=0;i<this.apmcookbookForm.value.cookbooklist.length;i++)
      {
        this.apmcookbookForm.value.cookbooklist[i].isSelectedToSave=false
      }
    }

    console.log(this.apmcookbookForm.value.cookbooklist)

    
    
  }

  checkboxClicked(event){
    for(let i=0;i<this.apmcookbookForm.value.cookbooklist.length;i++)
      {
        if(this.apmcookbookForm.value.cookbooklist[i].isSelectedToSave==false)
        {
          this.selectAllAPM=false;
          break;
        }
        else{
          this.selectAllAPM=true;
        }
      }
  }

}
