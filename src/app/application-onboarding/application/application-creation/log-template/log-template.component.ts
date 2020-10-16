import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Store } from '@ngrx/store';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { $ } from 'jquery'
import { CreateLogTemplate } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/logTemplate.model';
import * as fromFeature from '../../../store/feature.reducer';
import * as ApplicationActions from '../../store/application.actions';
import * as DataSourceActions from '../../../data-source/store/data-source.actions';
import { Input } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-log-template',
  templateUrl: './log-template.component.html',
  styleUrls: ['./log-template.component.less']
})
export class LogTemplateComponent implements OnInit, OnChanges {

  @ViewChild('scrollLogTopics', { read: ElementRef }) public scrollLogTopics: ElementRef;
  @ViewChild('scrollLogTags', { read: ElementRef }) public scrollLogTags: ElementRef;
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('clusterTagAdd', { read: ElementRef }) public clusterTagAdd: ElementRef;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  @Input() templateData: any;
  @Input() templateIndex: number;
  @Input() isEditMode: boolean;


  public editorOptions: JsonEditorOptions;
  public data: any = null;
  logTemplateData = null;
  selectedTab = 'logtemplate-form';
  isLinear = true;
  createLogForm: FormGroup;                      // log template create form
  logTopicsForm: FormGroup;                      // log topics create form
  logForm: CreateLogTemplate = null;             // It contain data of all 2 forms which send to backend after successful submission.
  dataSourceData: any;                           // It is use to store dataSource dropdown data.
  logAccountsList: string[];
    selectedDataSource: string;
    regFilterStatus: any;
    logSensitivityTypes: string[];
    loading = false; 
    logTopicsData: any;
    logCharacterization: any;
    autoDatasources: null;
    clusterTagFlag: boolean = false;
  logClusterData: any;
  clusterTagConfig: any;
  responseKeys : any;
    
  constructor(private _formBuilder: FormBuilder,public store: Store<fromFeature.State>) { }

  ngOnChanges(changes: SimpleChanges){
    if(this.isEditMode && this.templateData != null){
      this.data = this.templateData;
      this.selectedTab = 'logtemplate-editor';
    }else{
      this.selectedTab = 'logtemplate-form';
      this.data = null;
    }
  }

  ngOnInit(): void {

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

    this.getLogTopics();
    this.defineForms();

    this.onClickTab(this.selectedTab);

    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes

    this.store.select(fromFeature.selectLogTemplate).subscribe(
      (responseData) => {
        if(responseData.responseKeys != null && responseData.isloadedResponseKey){ 
            this.store.dispatch(ApplicationActions.loadedDataSourceResponseKey());         
            this.responseKeys = responseData.responseKeys;          
        }
      }
    );

  }

  // Below function is use to fetched json from json editor
  showJson(event = null){
    this.logTemplateData = this.editor.get();
  }

  // Below function is use to save log template data on click of save btn
  Submitlogdata(){
    if(this.isEditMode){
      this.store.dispatch(ApplicationActions.updatedLogTemplate({logTemplateData:this.logTemplateData,index:this.templateIndex}));
    }else{
      this.store.dispatch(ApplicationActions.createdLogTemplate({logTemplateData:this.logTemplateData}));
    }
    this.data = {};
  }

   // define log form

   defineForms() {
    this.createLogForm = new FormGroup({
     templateName: new FormControl('',[Validators.required]),
     monitoringProvider:  new FormControl('',Validators.required),
     accountName:  new FormControl('',Validators.required),
     namespace: new FormControl('',[Validators.required]),
     index: new FormControl('',[Validators.required]),
     kibanaIndex: new FormControl('',[Validators.required]),
     regExFilter: new FormControl(false),
     autoBaseline: new FormControl(false),
     regExResponseKey: new FormControl(''),
     regularExpression: new FormControl(''),
     sensitivity:  new FormControl('',Validators.required),


   });
   this.logTopicsForm = new FormGroup({
    topicsList: new FormArray([]),
    clusterList: new FormArray([]),
    clusterTagId: new FormControl(false),
  });

 this.logSensitivityTypes = ["high","low","medium"];

}


// Below function is use to populate Docker Image name dropdown after selecting ImageSourceData

onDataSourceSelect(dataSourceValue: string){
  if(dataSourceValue === 'elasticsearch'){
    this.createLogForm = new FormGroup({
      templateName: new FormControl(this.createLogForm.value.templateName,[Validators.required]),
      monitoringProvider:  new FormControl(this.createLogForm.value.monitoringProvider,Validators.required),
      accountName:  new FormControl('',Validators.required),
      index: new FormControl('',[Validators.required]),
      kibanaIndex: new FormControl('',[Validators.required]),
      regExFilter: new FormControl(this.createLogForm.value.regExFilter),
      regExResponseKey: new FormControl(''),
      regularExpression: new FormControl(''),
      autoBaseline: new FormControl(this.createLogForm.value.autoBaseline),
      sensitivity:  new FormControl(this.logSensitivityTypes[0],Validators.required),
    });
  } else if (dataSourceValue === 'kubernetes'){
    
    this.createLogForm = new FormGroup({
      templateName: new FormControl(this.createLogForm.value.templateName,[Validators.required]),
      monitoringProvider:  new FormControl(this.createLogForm.value.monitoringProvider,Validators.required),
      namespace: new FormControl('',[Validators.required]),
      autoBaseline: new FormControl(this.createLogForm.value.autoBaseline),
      sensitivity:  new FormControl(this.logSensitivityTypes[0],Validators.required),

    });
    
  } else {
    this.createLogForm = new FormGroup({
      templateName: new FormControl(this.createLogForm.value.templateName,[Validators.required, this.cannotContainSpace.bind(this)]),
      monitoringProvider:  new FormControl(this.createLogForm.value.monitoringProvider,Validators.required),
      accountName:  new FormControl('',Validators.required),
      autoBaseline: new FormControl(this.createLogForm.value.autoBaseline),
      sensitivity:  new FormControl(this.logSensitivityTypes[0],Validators.required),

    });
  }

    this.selectedDataSource = dataSourceValue;
   this.store.dispatch(ApplicationActions.loadMonitoringAccountName({monitoringSourceName:dataSourceValue}));
   this.store.select(fromFeature.selectLogTemplate).subscribe(
     (response) => {
     if(response.logAccountsData != null) {
         this.logAccountsList = response.logAccountsData;
     }else{
       this.logAccountsList = [];
     }
 }) 
}

// Below function is use to fetch the log topics

getLogTopics(){
 this.store.dispatch(ApplicationActions.loadLogTopics());
 this.store.dispatch(ApplicationActions.loadSupportingDatasources());
 this.store.dispatch(ApplicationActions.loadClusterTags());

 //fetching data from state
 this.store.select(fromFeature.selectLogTemplate).subscribe(
     (response) => {
       if(response.logTopicsList != null) {
        this.logTopicsForm = new FormGroup({
          topicsList: new FormArray([]),
          clusterList: new FormArray([]),
          clusterTagId: new FormControl(false),
        });
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
     }
    
 })   
}


//Below function is use to display elastic serach related fields

onCheckboxChange(status){
   this.regFilterStatus = status.target.checked;
}

onLogAccountSelect(accoutName){
  this.store.dispatch(ApplicationActions.fetchDataSourceResponseKey({accountName : this.createLogForm.value.accountName}));
}


onClusterChange(status: boolean){

  this.clusterTagFlag = status;
  if(status === true){
    this.store.select(fromFeature.selectLogTemplate).subscribe(
      (response) => {
    if(response.logClusterTags != null){
      
      this.loading = response.logClusterLoading;
      this.logClusterData = response.logClusterTags['clusterTopics'];
      this.clusterTagConfig = response.logClusterTags['clusterTags'];
             
      // Populating Cluster 
           
    this.logClusterData.forEach((logClusterData, logClusterIndex) => {
     (<FormArray>this.logTopicsForm.get('clusterList')).push(
      new FormGroup({
         string: new FormControl(logClusterData.string),
         tag: new FormControl(logClusterData.tag)
       })
     );
  });
    }
  })   
  }
  

}

// Below function to get final form input details

SubmitForm(){
   this.logForm = this.createLogForm.value;
   if(this.clusterTagFlag === true){
    this.logForm['Tags'] = this.logTopicsForm.value['clusterList'];
   }else{
    this.logForm['Tags'] = '';
   }
   this.logForm['errorTopics'] = this.logTopicsForm.value['topicsList'];
   this.logTemplateData = this.logForm;

   // Action to create the log template   
   this.store.dispatch(ApplicationActions.createdLogTemplate({logTemplateData:this.logTemplateData}))
   if(this.stepper != undefined){
     this.stepper.reset();
   }
   this.logTopicsForm.value['clusterTagId'] = false;
   this.createLogForm.value['autoBaseline'] = false;
   this.createLogForm.value['regExFilter'] = false;
    this.createLogForm.reset();
    this.logTopicsForm.reset();
    this.selectedDataSource =  null;
}

// Below function to add new log topics

addNewLogTopics(){
  this.scrollLogTopics.nativeElement.scrollTop = this.scrollLogTopics.nativeElement.scrollHeight;
  (<FormArray>this.logTopicsForm.get('topicsList')).push(
    new FormGroup({
      string: new FormControl('', Validators.required),
      topic: new FormControl('', Validators.required),
      type: new FormControl('custom', Validators.required)
    })
  );
}

// delete log topics

deleteLogTopic(topic,index){
  (<FormArray>this.logTopicsForm.get('topicsList')).removeAt(index);
  this.logTopicsForm.get('topicsList')['controls'].splice(index, 1);
}

addNewClusterTag(){
  //this.scroll.nativeElement. = this.scroll.nativeElement.
  this.scrollLogTags.nativeElement.scrollTop = this.scrollLogTags.nativeElement.scrollHeight;
  
  (<FormArray>this.logTopicsForm.get('clusterList')).push(
    new FormGroup({
      string: new FormControl('', Validators.required),
      tag: new FormControl('', Validators.required)
    })
  );
}


// delete cluster tag

deleteClusterTag(cluster,index){
  (<FormArray>this.logTopicsForm.get('clusterList')).removeAt(index);
  this.logTopicsForm.get('clusterList')['controls'].splice(index,1);
}

//Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error

cannotContainSpace(control: FormControl): {
  [s: string]: boolean
} {
  let startingValue = control.value.split('');
  if (startingValue.length > 0 && (control.value as string).indexOf(' ') >= 0) {
      return {
          containSpace: true
      }
  }
  if (+startingValue[0] > -1 && startingValue.length > 0) {
      return {
          startingFromNumber: true
      }
  }
  if (!/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
      return {
          symbols: true
      };
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

  // Below function is to reset the form
  cancelLogForm(){
    this.createLogForm.reset();
    this.logTopicsForm.reset(); 
    this.stepper.reset();
   
  }


}
