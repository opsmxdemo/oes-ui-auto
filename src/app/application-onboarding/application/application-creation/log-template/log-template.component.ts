import { Component, OnInit, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Store } from '@ngrx/store';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { $ } from 'jquery'
import { CreateLogTemplate } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/logTemplate.model';
import * as fromFeature from '../../../store/feature.reducer';
import * as ApplicationActions from '../../store/application.actions';
import * as DataSourceActions from '../../../data-source/store/data-source.actions';


@Component({
  selector: 'app-log-template',
  templateUrl: './log-template.component.html',
  styleUrls: ['./log-template.component.less']
})
export class LogTemplateComponent implements OnInit {

  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;


  public editorOptions: JsonEditorOptions;
  public data: any = null;
  logTemplateData = null;
  selectedTab = 'logtemplate-form';
  createLogForm: FormGroup;                      // log template create form
  logTopicsForm: FormGroup;                      // log topics create form
  logForm: CreateLogTemplate = null;             // It contain data of all 2 forms which send to backend after successful submission.
  dataSourceData: any;                        // It is use to store dataSource dropdown data.
  logAccountsList: string[];
    selectedDataSource: any;
    regFilterStatus: any;
    logSensitivityTypes: string[];
    loading = false; 
    logTopicsData: any;
    logCharacterization: any;
    autoDatasources: null;

  constructor(private _formBuilder: FormBuilder,public store: Store<fromFeature.State>) { }

  ngOnInit(): void {

    this.store.dispatch(DataSourceActions.loadDatasourceList());
    this.store.select(fromFeature.selectDataSource).subscribe(
      (responseData) => {
        if(responseData.supportedDatasource != null){
          if(responseData.supportedDatasource.autopilotDataSources != null){
            this.autoDatasources = responseData.supportedDatasource.autopilotDataSources;
            console.log(this.autoDatasources);
          }
        }
      }
    );

    this.getLogTopics();
    this.defineForms();

    this.onClickTab(this.selectedTab);

    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
  }

  // Below function is use to fetched json from json editor
  showJson(event = null){
    this.logTemplateData = this.editor.get();
  }

  // Below function is use to save log template data on click of save btn
  Submitlogdata(){
    this.store.dispatch(ApplicationActions.createdLogTemplate({logTemplateData:this.logTemplateData}))
    this.data = {};
  }

  // changes related to FORM submission goes here
   // define log form
   defineForms() {
    this.createLogForm = new FormGroup({
     templateName: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)]),
     monitoringProvider:  new FormControl('',Validators.required),
     accountName:  new FormControl('',Validators.required),
     namespace: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)]),
     index: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)]),
     kibanaIndex: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)]),
     regExFilter: new FormControl(false),
     regExResponseKey: new FormControl(''),
     regularExpression: new FormControl(''),
     sensitivity:  new FormControl('',Validators.required),

   });

  // this.logTopicsForm = new FormGroup

   this.logTopicsForm = new FormGroup({
     topicsList: new FormArray([])
   });


 
 this.logSensitivityTypes = ["high","low","medium"];
}

// Below function is use to populate Docker Image name dropdown after selecting ImageSourceData
onDataSourceSelect(dataSourceValue){
  debugger
    this.selectedDataSource = dataSourceValue;
   //this.store.dispatch(ApplicationActions.loa({dataSource:dataSourceValue}));
   this.store.dispatch(ApplicationActions.loadMonitoringAccountName({monitoringSourceName:dataSourceValue}));

   this.store.select(fromFeature.selectApplication).subscribe(
     (response) => {
     if(response.logAccountsData != null) {
         //this.loading = response.l;
         this.logAccountsList = response.logAccountsData;
         console.log(response.logDataSources);
     }
 })

   //this.logAccountsList = ["account1","account2","account3","account4","account5"];
 
}

// Below function is use to fetch the log topics
getLogTopics(){
 this.store.dispatch(ApplicationActions.loadLogTopics());
 this.store.dispatch(ApplicationActions.loadSupportingDatasources());
 //fetching data from state
 this.store.select(fromFeature.selectApplication).subscribe(
     (response) => {
       if(response.logTopicsList !== null) {
         this.loading = response.logListLoading;
         
         this.logTopicsData = response.logTopicsList['logTopics'];
         this.logCharacterization = response.logTopicsList['topics'];
          // Populating logtopics 
     this.logTopicsData.forEach((logTopicsData, logIndex) => {
         (<FormArray>this.logTopicsForm.get('topicsList')).push(
           new FormGroup({
             string: new FormControl(logTopicsData.string),
             topic: new FormControl(logTopicsData.topic),
             type: new FormControl(logTopicsData.type)
           })
         );
 });
     }
     if(response.logDataSources != null) {
         this.loading = response.logDataSourcesLoading;
         this.dataSourceData = response.logDataSources;
         console.log(response.logDataSources);
     }
 })

    
}


//Below function is use to display elastic serach related fields
onCheckboxChange(status){
   this.regFilterStatus = status.target.checked;
}

SubmitForm(){

 if(this.selectedDataSource === 'ealsticsearch'){
     this.createLogForm = new FormGroup({
         templateName: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)]),
         monitoringProvider:  new FormControl('',Validators.required),
         accountName:  new FormControl('',Validators.required),
         index: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)]),
         kibanaIndex: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)]),
         regExFilter: new FormControl(false),
         regExResponseKey: new FormControl(''),
         regularExpression: new FormControl(''),
         sensitivity:  new FormControl('',Validators.required),
 
       });
 }else if(this.selectedDataSource === 'kubernetes'){

 }else{

 }

   console.log(this.createLogForm.value);
   console.log(this.logTopicsForm.value);
   this.logForm = this.createLogForm.value;
   this.logForm.errorTopics = this.logTopicsForm.value;
   console.log(this.logForm);

}


//Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error
cannotContainSpace(control: FormControl): {[s: string]: boolean} {
 let startingValue = control.value.split('');
if(startingValue.length > 0 && (control.value as string).indexOf(' ') >= 0){
 return {containSpace: true}
}
if( +startingValue[0] > -1 && startingValue.length > 0){
 return {startingFromNumber: true}
}
if ( !/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
 return {symbols: true};
}
return null;
}

   // Below function is execute on click of Form or Editor tab.
   onClickTab(event){
    if(event === 'logtemplate-form-tab'){
      this.selectedTab = 'logtemplate-form';
    } else if(event === 'logtemplate-editor-tab') {
      this.selectedTab = 'logtemplate-editor';
    }
  }


}
