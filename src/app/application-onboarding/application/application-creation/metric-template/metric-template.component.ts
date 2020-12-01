import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import * as fromFeature from '../../../store/feature.reducer';
import * as ApplicationActions from '../../store/application.actions';
import { Store } from '@ngrx/store';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as DataSourceActions from '../../../data-source/store/data-source.actions';
import { MatHorizontalStepper } from '@angular/material/stepper';
import * as $ from 'jquery';

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
  @Input() applicationData : any;

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
  selectAllAPM:boolean=true;
  templateDataGroups : any;
  apmExpand:any=false;
  infraExpand:any=false;

  constructor(private _formBuilder: FormBuilder,
    public store: Store<fromFeature.State>) { }

  ngOnChanges(changes: SimpleChanges){
    if(this.isEditMode && this.templateData != null ){
      this.data = this.templateData;           
      if(this.templateData.data.groups[0].metrics[0].metricType == 'ADVANCED'){
        this.selectedTab = 'metric-form';
        this.onChangeDatasource(this.templateData.advancedProvider,'custom');
        this.populateCustomMetricForm();
      }else if(this.templateData.data.groups[0].metrics[0].metricType == 'APM' ||  this.templateData.data.groups[0].metrics[0].metricType == 'Infrastructure'){
        this.selectedTab = 'metric-apminfra';
        this.onChangeDatasource(this.templateData.apmProvider,'apm');
        this.onChangeDatasource(this.templateData.infraProvider,'infra');
      }
    }else{
      this.selectedTab = 'metric-apminfra';
      this.data = null;
      this.intializeForms();
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
          if(responseData.APMDSAccounts.length > 0){
            this.APMDSAccounts = responseData.APMDSAccounts;
            if(this.isEditMode){
              if(this.templateData != null){    
                if(this.templateData.data != undefined){               
                  if(this.templateData.data.groups.length > 0){  
                    var groupsArray = this.templateData.data.groups;  
                    this.templateDataGroups = groupsArray.filter(i => i.metrics.length > 0);
                    var apm = this.templateDataGroups.filter(i => i.metrics[0].metricType == 'APM');
                    if(apm.length > 0){
                      this.onChangeDSAccount(apm[0].metrics[0].accountName,'apm');
                      this.apmFormGroup.patchValue({
                        apmProviderAccount : apm[0].metrics[0].accountName
                      });
                    }                   
                  }
                }
              }
            } 
          }                   
        }
        if(responseData.InfraDSAccounts != null && responseData.isLoadedAccountForInfraDataScource){
          this.store.dispatch(ApplicationActions.loadedAccountForInfraDataSource());
          if(responseData.InfraDSAccounts.length > 0){
            this.InfraDSAccounts = responseData.InfraDSAccounts;
            if(this.isEditMode){
              if(this.templateData != null){    
                if(this.templateData.data != undefined){               
                  if(this.templateData.data.groups.length > 0){   
                    var groupsArray = this.templateData.data.groups;  
                    this.templateDataGroups = groupsArray.filter(i => i.metrics.length > 0);                   
                    var infra = this.templateDataGroups.filter(i => i.metrics[0].metricType == 'Infrastructure');
                    if(infra.length > 0){
                      this.onChangeDSAccount(infra[0].metrics[0].accountName,'infra');
                      this.infraFormGroup.patchValue({
                        infraProviderAccount : infra[0].metrics[0].accountName
                      });
                    }                                        
                  }
                }
              }              
            }
          } 
        }
        if(responseData.APMApplicationForAccounts != null && responseData.isLoadedApplicationForAPM){
          this.store.dispatch(ApplicationActions.loadedApplicationForAPMAccounts());
          this.APMApplicationForAccounts = responseData.APMApplicationForAccounts;
          if(this.isEditMode){
            this.onChangeAccountForDS(this.templateData.datasourceAppName,'apm');
          }
        }
        if(responseData.INFRACookbook != null && responseData.isLoadedInfraCookbook){
          this.store.dispatch(ApplicationActions.loadedInfraGenerateCookbook());
          this.INFRACookbook = responseData.INFRACookbook;
          if(this.INFRACookbook != null){  
            if(this.INFRACookbook.data != undefined){                               
              if(this.INFRACookbook.data.groups.length > 0){
                this.INFRACooknookGroups = this.INFRACookbook.data.groups;
                this.INFRACooknookGroups.controls['selectAll'].setValue(true);
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
                 if(this.isEditMode){                  
                  this.prepopulateApmInfraForm();
                }
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
                  this.apmcookbookForm.controls['selectAll'].setValue(true);
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
                  if(this.isEditMode){                  
                    this.prepopulateApmInfraForm();
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
        group : new FormControl('', [
          Validators.required
        ]),
        name: new FormControl('', [
          Validators.required
        ]),
        riskDirection: new FormControl('HigherOrLower'),
        customThresholdHigher : new FormControl('10', [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
        customThresholdLower : new FormControl('10', [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
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
      selectAll:new FormControl(true),
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
      selectAll:new FormControl(true),
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
      this.metricTemplateData['applicationId'] = this.applicationData['applicationId'];
      this.metricTemplateData['applicationName'] = this.applicationData['name'];
      this.metricTemplateData['emailId'] = this.applicationData['email'];
      this.metricTemplateData['isEdit'] = true;
      this.store.dispatch(ApplicationActions.editMetricTemplate({applicationId : this.applicationData['applicationId'], templateName: this.metricTemplateData['templateName'], metricTemplateDataToEdit : this.metricTemplateData}));
      //this.store.dispatch(ApplicationActions.updatedMetricTemplate({metricTemplateData:this.metricTemplateData,index:this.templateIndex}));
    }else{
      //datasourceAppName
      this.metricTemplateData['applicationId'] = this.applicationData['applicationId'];
      this.metricTemplateData['applicationName'] = this.applicationData['name'];
      this.metricTemplateData['emailId'] = this.applicationData['email'];
      this.metricTemplateData['isEdit'] = false;
      this.store.dispatch(ApplicationActions.saveMetricTemplate({applicationId : this.applicationData['applicationId'], metricTemplateData : this.metricTemplateData}));
      //this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.metricTemplateData}));
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
    if(this.queryForm.invalid){
      return;
    }
    this.metricTemplateFormData = {
      "applicationId"   : this.applicationData['applicationId'],
      "applicationName" : this.applicationData['name'],
      "emailId"         : this.applicationData['email'],
      "isEdit"          : this.isEditMode,
      "templateName" : this.createMetricForm.value.templateName,
      "data": {
        "groups" : [],
        "isNormalize": false,
        "percent_diff_threshold" : 'hard'
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
    
    if(this.isEditMode){
      this.store.dispatch(ApplicationActions.editMetricTemplate({applicationId : this.applicationData['applicationId'], templateName: this.metricTemplateFormData['templateName'], metricTemplateDataToEdit : this.metricTemplateFormData}));
      this.clearFormData();

    }else{
      this.store.dispatch(ApplicationActions.saveMetricTemplate({applicationId : this.applicationData['applicationId'], metricTemplateData : this.metricTemplateFormData}));

    }
  
    //this.metricTemplateFormData.data.groups=groupObj;
    //this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.metricTemplateFormData}));
    this.clearFormData();
    
  }

  addNewQuery(){
    (<FormArray>this.queryForm.get('queryList')).push(
      new FormGroup({
        group : new FormControl('', [
          Validators.required
        ]),
        name: new FormControl('', [
          Validators.required
        ]),
        riskDirection: new FormControl('HigherOrLower'),
        customThresholdHigher : new FormControl('10', [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
        customThresholdLower : new FormControl('10', [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
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
    if(this.isEditMode){
      this.apminfraTemplate = {
        "applicationId"     : this.applicationData['applicationId'],
        "applicationName"   : this.applicationData['name'],
        "emailId"           : this.applicationData['email'],
        "isEdit"            : true,
        "templateName"      : this.apmFormGroup.controls.templateName.value,
        "datasourceAppName" : this.apmFormGroup.controls.apmApplication.value,
        "data"              : {
                                "groups" : [],
                                "isNormalize": this.metricConfigForm.controls.isNormalize.value,
                                "percent_diff_threshold" : (this.metricConfigForm.controls.threshold.value ? "easy" :"hard")
                              }
      };  
      
      var cookbookArray = [];
      cookbookArray = this.apmcookbookForm.value.cookbooklist.concat(this.infracookbookForm.value.cookbooklist);
      var filteredCookbookArray = [];
      filteredCookbookArray = cookbookArray.filter(obj => obj.isSelectedToSave == true);
      this.apminfraTemplate.data.groups =filteredCookbookArray;
      this.store.dispatch(ApplicationActions.editMetricTemplate({applicationId : this.applicationData['applicationId'], templateName: this.apmFormGroup.value.templateName, metricTemplateDataToEdit : this.apminfraTemplate}));
    }else{
      this.apminfraTemplate = {
        "applicationId"     : this.applicationData['applicationId'],
        "applicationName"   : this.applicationData['name'],
        "emailId"           : this.applicationData['email'],
        "isEdit"            : false,
        "templateName"      : this.apmFormGroup.value.templateName,
        "datasourceAppName" : this.apmFormGroup.value.apmApplication,
        "data"              : {
                                "groups" : [],
                                "isNormalize": this.metricConfigForm.value.isNormalize,
                                "percent_diff_threshold" : (this.metricConfigForm.value.threshold ? "easy" :"hard")
                              }
      };  
      
      var cookbookArray = [];
      cookbookArray = this.apmcookbookForm.value.cookbooklist.concat(this.infracookbookForm.value.cookbooklist);
      var filteredCookbookArray = [];
      filteredCookbookArray = cookbookArray.filter(obj => obj.isSelectedToSave == true);
      this.apminfraTemplate.data.groups =filteredCookbookArray;
      this.store.dispatch(ApplicationActions.saveMetricTemplate({applicationId : this.applicationData['applicationId'], metricTemplateData : this.apminfraTemplate}));
      //this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:this.apminfraTemplate}));
      this.clearFormData();
    }      
    
  }

  clearFormData(){
    this.createMetricForm.reset();
    this.queryForm = new FormGroup({
      queryList: new FormArray([])
    });
    (<FormArray>this.queryForm.get('queryList')).push(
      new FormGroup({
        group : new FormControl('', [
          Validators.required
        ]),
        name: new FormControl('', [
          Validators.required
        ]),
        riskDirection: new FormControl('HigherOrLower'),
        customThresholdHigher : new FormControl('10', [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
        customThresholdLower : new FormControl('10', [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
        critical: new FormControl(false),
        watchlist : new FormControl(false),
        metricWeight: new FormControl('1')
      })
    );
    this.apmFormGroup.reset();
    this.infraFormGroup.reset();

    this.infracookbookForm = new FormGroup({
      selectAll:new FormControl(true),
      cookbooklist: new FormArray([       
      ])
    });


    this.apmcookbookForm = new FormGroup({
      selectAll:new FormControl(true),
      cookbooklist: new FormArray([        
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
      let cookbookArray = this.apmcookbookForm.get('cookbooklist') as FormArray
      for(let i=0;i<cookbookArray.length;i++)
      {
        
        cookbookArray.controls[i].get('isSelectedToSave').setValue(true);
      }
    }
    else{
      let cookbookArray = this.apmcookbookForm.get('cookbooklist') as FormArray
      for(let i=0;i<cookbookArray.length;i++)
      {
        
        cookbookArray.controls[i].get('isSelectedToSave').setValue(false);
      }
    }

    //console.log(this.apmcookbookForm.value.cookbooklist)

    
    
  }
  
  onselectAllInfra(event){
    var CheckedValue = event.target.checked
    
    if(CheckedValue==true)
    {
      let cookbookArray = this.infracookbookForm.get('cookbooklist') as FormArray
      for(let i=0;i<cookbookArray.length;i++)
      {
        
        cookbookArray.controls[i].get('isSelectedToSave').setValue(true);
      }
    }
    else{
      let cookbookArray = this.infracookbookForm.get('cookbooklist') as FormArray
      for(let i=0;i<cookbookArray.length;i++)
      {
        
        cookbookArray.controls[i].get('isSelectedToSave').setValue(false);
      }
    }

    //console.log(this.apmcookbookForm.value.cookbooklist)

    
    
  }
  checkboxClicked(event,metricName){
    if(metricName=="apm"){
      let cookbookArray = this.apmcookbookForm.get('cookbooklist') as FormArray;
    for(let i=0;i<cookbookArray.length;i++)
      {
        let iteratedIsSelectedToSave = cookbookArray.controls[i].get('isSelectedToSave') as FormControl
        if(iteratedIsSelectedToSave.value==true)
        {
          this.apmcookbookForm.get('selectAll').setValue(true)
        }
        else{
          this.apmcookbookForm.get('selectAll').setValue(false)
          break;
        }
      }
    }
    else{
      let cookbookArray = this.infracookbookForm.get('cookbooklist') as FormArray;
    for(let i=0;i<cookbookArray.length;i++)
      {
        let iteratedIsSelectedToSave = cookbookArray.controls[i].get('isSelectedToSave') as FormControl
        if(iteratedIsSelectedToSave.value==true)
        {
          this.infracookbookForm.get('selectAll').setValue(true)
        }
        else{
          this.infracookbookForm.get('selectAll').setValue(false)
          break;
        }
      }
    }
    
    
  }


  //Function to form based edit apm infra metric template
  prepopulateApmInfraForm(){
    //console.log(this.templateData);
    
    this.apmFormGroup.patchValue({
      templateName : this.templateData.templateName,
      apmProvider : this.templateData.apmProvider,
      apmApplication : this.templateData.datasourceAppName
    });
    this.infraFormGroup.patchValue({
      infraProvider : this.templateData.infraProvider
    });
    this.metricConfigForm.patchValue({
      isNormalize : this.templateData.data.isNormalize,
      threshold   : (this.templateData.data.percent_diff_threshold == 'easy' ? true : false)
    });
    //code to disable the non editable values

    this.apmFormGroup.controls.templateName.disable();
    this.apmFormGroup.controls.apmProvider.disable();
    this.apmFormGroup.controls.apmApplication.disable();
    this.apmFormGroup.controls.apmProviderAccount.disable();

    this.infraFormGroup.controls.infraProvider.disable();
    this.infraFormGroup.controls.applicationName.disable();

    this.metricConfigForm.controls.isNormalize.disable();
    this.metricConfigForm.controls.threshold.disable();

    //this.apmcookbookForm.controls.cookbooklist.disable();
    //this.infracookbookForm.controls.cookbooklist.disable();

    if(this.templateData != null){    
      if(this.templateData.data != undefined){               
          if(this.templateData.data.groups.length > 0){

            var groupsArray = this.templateData.data.groups;  
            this.templateDataGroups = groupsArray.filter(i => i.metrics.length > 0);
            var apm = this.templateDataGroups.filter(i => i.metrics[0].metricType == 'APM');
            var infra = this.templateDataGroups.filter(i => i.metrics[0].metricType == 'Infrastructure');

            if(apm.length > 0){
              this.apmFormGroup.patchValue({
                apmProviderAccount : apm[0].metrics[0].accountName
              });
            }
            if(infra.length > 0){
              this.infraFormGroup.patchValue({
                applicationName : infra[0].metrics[0].accountName
              });
            }

            //code to remove all items from the Form before pushing
            const control = <FormArray>this.apmcookbookForm.controls['cookbooklist'];
                for(let i = control.length-1; i >= 0; i--) {
                    control.removeAt(i)
            }
            if(apm.length > 0){
            apm.forEach((cookbook,cookbookindex) => {
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
                    critical : new FormControl(metricObj.critical),
                    watchlist : new FormControl(metricObj.watchlist)
                  })
                )
              })                               
             });
            }

             //code to remove all items from the Form before pushing
             const control1 = <FormArray>this.infracookbookForm.controls['cookbooklist'];
             for(let i = control.length-1; i >= 0; i--) {
              control1.removeAt(i)
             }
             if(infra.length > 0){
              infra.forEach((cookbook,cookbookindex) => {
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
                      critical : new FormControl(metricObj.critical),
                      watchlist : new FormControl(metricObj.watchlist)                    
                    })
                  )
                })
              });
            }

            }
          }
        }
    // this.apmcookbookForm.get('cookbooklist')).patchValue({
    //   group: 
    //   isSelectedToSave :new FormControl(true),
    //   metrics: new FormArray([])
    // });
    //this.deploymentVerificationForm.patchValue({metricTemplate : this.metricTemplateList[index]}); 
  }
  
  // this function to populate fields in edit mode of custom metric form
  populateCustomMetricForm(){
          //Form for custom metric
          this.createMetricForm = new FormGroup({
            templateName: new FormControl(this.templateData.templateName,Validators.required),
            dataSource : new FormControl({value: this.templateData.advancedProvider,disabled: true}),
            accountName : new FormControl(this.templateData.data.groups[0].metrics[0].accountName),
            data: new FormGroup({
              groups : new FormArray([])
            })
          });
      
          this.queryForm = new FormGroup({
            queryList: new FormArray([])
          });
      
          this.templateData.data.groups.forEach(queryData => {
            (<FormArray>this.queryForm.get('queryList')).push(
              new FormGroup({
              group : new FormControl(queryData.group),
              name: new FormControl(queryData.metrics[0].name),
              riskDirection: new FormControl(queryData.metrics[0].riskDirection),
              customThresholdHigher : new FormControl(queryData.metrics[0].customThresholdHigher),
              customThresholdLower : new FormControl(queryData.metrics[0].customThresholdLower),
              critical: new FormControl(queryData.metrics[0].critical),
              watchlist : new FormControl(queryData.metrics[0].watchlist),
              metricWeight: new FormControl(queryData.metrics[0].metricWeight)
              })
            );
          })
  }
  expandCollapseMetric(index){
    
      $(".childMetric"+index).hide()
    
   
  }

}
