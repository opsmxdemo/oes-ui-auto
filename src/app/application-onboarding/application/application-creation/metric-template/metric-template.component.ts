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
  INFRACookbook:any;
  INFRACooknookGroups : any;
  apmcookbookForm :FormGroup;
  APMCookbook :any;
  APMCookbookGroups :any;
  infracookbookForm : FormGroup;
  selectedAPMDSAccount :any;
  apminfraTemplate = null;

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
        // if(responseData.INFRACookbook != null){
        //   this.INFRACookbook = responseData.INFRACookbook;
        // }
        // if(responseData.APMCookbook != null){
        //   this.APMCookbook = responseData.APMCookbook;
        // }
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

    this.infracookbookForm = new FormGroup({
      cookbooklist: new FormArray([
        new FormGroup({
          group : new FormControl(),
          isSelectedToSave : new FormControl(true),
          metrics: new FormArray([
            new FormGroup({
              name: new FormControl(),                      
              accountName : new FormControl(),
              aggregator : new FormControl(),
              displayUnit : new FormControl(),
              label : new FormControl(),
              metricType : new FormControl()
            })
          ])
        })
      ])
    });


    this.apmcookbookForm = new FormGroup({
      cookbooklist: new FormArray([
        new FormGroup({
          group : new FormControl(),
          isSelectedToSave : new FormControl(true),
          metrics: new FormArray([
            new FormGroup({
              name: new FormControl(),                      
              accountName : new FormControl(),
              aggregator : new FormControl(),
              displayUnit : new FormControl(),
              label : new FormControl(),
              metricType : new FormControl()
            })
          ])
        })
      ])
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
    if(event === 'metric-form-tab'){
      this.selectedTab = 'metric-form';
    } else if(event === 'metric-editor-tab') {
      this.selectedTab = 'metric-editor';
    }else if(event === 'metric-apminfra-tab') {
      this.selectedTab = 'metric-apminfra';
    }
  }

  onChangeDatasource(datasource,type){
    this.APMDSAccounts = "";
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
    if(type == 'apm'){
      this.selectedAPMDSAccount = dsAccount;
      this.store.dispatch(ApplicationActions.fetchApplicationForAPMAccounts({sourceType: this.selectedAPMDataSource, account: dsAccount}));
    }else if(type== 'infra'){
     
      //this.infracookbookForm.reset();
      this.store.dispatch(ApplicationActions.fetchInfraGenerateCookbook({account:dsAccount,applicationName:dsAccount,metricType:'INFRA',sourceType:this.selectedINFRADataSource,templateName:this.apmFormGroup.value.templateName}));     
      this.store.select(fromFeature.selectApplication).subscribe(
        (responseData) => {         
          if(responseData.INFRACookbook != null){
            this.INFRACookbook = responseData.INFRACookbook;
                      
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
                      label : new FormControl (metricObj.label),
                      metricType : new FormControl(metricObj.metricType)
                    })
                  )

                 
                })

               });
            }
                     
          }
          
        }
      );
      
    }
     
  }

  onChangeAccountForDS(dsApplication, type){
    if(type == 'apm'){
      //this.apmcookbookForm.reset();
      this.store.dispatch(ApplicationActions.fetchAPMGenerateCookbook({account:this.selectedAPMDSAccount,applicationName:dsApplication,metricType:'APM',sourceType:this.selectedAPMDataSource,templateName:this.apmFormGroup.value.templateName}));     
      this.store.select(fromFeature.selectApplication).subscribe(
        (responseData) => {         
          if(responseData.APMCookbook != null){
            this.APMCookbook = responseData.APMCookbook;
                    
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
                      metricType : new FormControl(metricObj.metricType)
                    })
                  )
                })                               
               });
            }
         
          }
          
        }
      );
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
      "applicationName": this.apmFormGroup.value.applicationName,
      "data": {
        "groups" : []
      }
    };  
    
    var cookbookArray = [];
    cookbookArray = this.apmcookbookForm.value.cookbooklist.concat(this.infracookbookForm.value.cookbooklist)
    this.apminfraTemplate.data.groups =cookbookArray;
    this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.apminfraTemplate}));
    
  }


}
