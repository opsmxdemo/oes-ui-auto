import { JsonEditorComponent, JsonEditorOptions } from "ang-jsoneditor";
import { Component, OnInit, ViewChild, HostListener, ViewEncapsulation,ElementRef, Input ,NgZone } from '@angular/core';
// platform-service-ui change
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';
import { FormControl , FormArray} from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as fromFeature from './store/feature.reducer';
import * as fromApp from '../../store/app.reducer';
import * as DeploymentAction from './store/deploymentverification.actions';
import * as ApplicationDashbordAction from '../application-dashboard/store/dashboard.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { MatSidenav } from '@angular/material/sidenav';
import Swal from 'sweetalert2';
import { AnyTxtRecord } from 'dns';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';

export interface User {
  applicationName: string;
  id: any;
}

@Component({
  selector: 'app-deployment-verification',
  templateUrl: './deployment-verification.component.html',
  styleUrls: ['./deployment-verification.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class DeploymentVerificationComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
  @ViewChild('sideNav') Sidenav: MatSidenav;
  @ViewChild('focus') focused: ElementRef;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  @ViewChild('manualTrigerModal') manualTrigerModal: ElementRef;
  public editorOptions: JsonEditorOptions;
  // public data: any = null;
  data = {}

  size = 5343454545;
  applicationForm: FormGroup;
  deployementRun: any;
  reclassificationHistory: any;
  canaries: string[] = [];
  filteredCanaries: Observable<string[]>;
  control = new FormControl(this.deployementRun);
  canaryList: string[];
  incredementDisable = false;
  decrementDisable = false;
  deployementLoading: boolean = true;
  showFiller = false;
  nav_position: string = 'end';
  counter = 1;
  serviceConter = 1;
  canaryCheckCounter = 1;
  selectedTab = '';  
  showSearch:boolean=false;                               // this variable is use to store value of selected tab.

  ///code for showing select application shows here
  myControl = new FormControl();
  options: User[] = [];
  filteredOptions: Observable<User[]>;
  isShow = false;
  deployementApplications: any;
  deploymentServices: any;
  deploymentApplicationHealth = {};
  deploymentServiceInformation = {};

  // App form initia

  applicationList = [];
  applicationExists: boolean;
  canaryIdExists: boolean;
  serviceIdExists: boolean = false;

  applicationListOptions: Observable<any[]>;
  applicationId: any;
  selectedApplicationName: any;
  canaryId: number;
  serviceNameInfo = {};

  //pagination for service table
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.
  serviceListData: any;
  selectedServiceId: number;                                                           // It use to store Accountlist data fetched from state.
  searchData: string = '';                                                             // this is use to fetch value from search field.
  perPageData: number = 10;                                                            // this is use to populate value in perPage dropdown exist in pagination.
  page = {                                                                             // this is use to support pagination in accunt page.
    startingPoint: 0,
    endPoint: 10,
    pageSize: 10,
    currentPage: 1,
    pageNo: 1,
  }
  currentPage = [];                                                                    // this use to store array of data exists in current page.
  serviceListLength: number = null;
  baseLineFileSize: any;
  canaryFileSize: any;
  latestCounter = 1;
  latestCanaryCounter = 1;
  cancelRunningCanaryData: any;

  wizardView: boolean = true;
  manualTriggerData: any;
  selectedManualTriggerTab: string;
  defaultServiceId: boolean = false;
  initializeCanaryList: boolean = true;


  serviceIdAfterRerun: any = null;     //variable used to set service Id from child component log analysis after rerun
  manualTriggerLatestRun: number;
  isRerunLogs : boolean = false;
  serviceIdFromChild :any = null;
  statusOfSelectedService : any;

  manualTriggerForm : FormGroup;

  applications : any;
  servicesOfApplication : any;
  logServiceForm: FormGroup;
  metricServiceForm : FormGroup;

  username: any;

  @ViewChild('picker') picker: any;
  @ViewChild('picker1') picker1: any;

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

 

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];
  // App form end

  constructor(private route: ActivatedRoute, public sharedService: SharedService, public store: Store<fromFeature.State>,
    public autopilotService: AutopiloService, public notifications: NotificationService, public appStore: Store<fromApp.AppState>,
    private fb: FormBuilder, private router: Router,private zone: NgZone) {
  }

  // Below function is use to capture events occur in matric analysis component and make responsive to table.
  @HostListener('window:click', ['$event'])
  handleClick(target) {
    const targetnode = target.target;
    if (targetnode.textContent === 'Log Analysis' ||
      targetnode.textContent === 'Metric Analysis' ||
      targetnode.textContent === 'Correlation'||
      targetnode.classList['value'] === 'service-selection') {
      this.Sidenav.close();
      this.isShow = false;
    }
  }


  ngOnInit(): void {
      // fix for the scroll position from App dashboard - it was loading somewhere from the middle
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
        
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.selectedManualTriggerTab = 'manualTrigger-form-tab'; //setting default tab selected as form

    // hide tooltip 
    $("[data-toggle='tooltip']").tooltip('hide');
    this.selectedTab = '';
    this.getAllApplications();

    this.store.dispatch(ApplicationDashbordAction.loadAppDashboard());
    this.initializeForms();

    if (this.route.params['_value'].applicationName != null && this.route.params['_value'].canaryId != null) {
      this.canaryId = this.route.params['_value'].canaryId;
      this.canaryId = Number(this.route.params['_value'].canaryId);
      //to check if the canary exists or not
      this.checkIfCanaryExists(this.canaryId)
      this.selectedApplicationName = this.route.params['_value'].applicationName;
     
      this.getApplicationHelathAndServiceDetails(this.canaryId);
    } else {
      this.appStore.select('auth').subscribe(
        (response) => {
          if (response.authenticated) {
            this.getLatestRun();
          }
        }
      )
    }


    if (this.canaries.length > 0) {
      this.filteredCanaries = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCanaries(value))
      );
    }

    // Below code get the feature data from state

    this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
      (resData) => {
        if (resData.reclassificationHistoryResults != null) {
          this.reclassificationHistory = resData.reclassificationHistoryResults
        }
        if (resData.manualTriggerResponse != null) {
          this.manualTriggerLatestRun = resData['canaryId'];
          this.control.setValue(resData['canaryId']);
          this.canaryId = resData['canaryId'];
        }

        if (resData.applicationHealthDetails != null && resData.isloadedApplicationHealth) {
          this.store.dispatch(DeploymentAction.loadedApplicationHealth());
          this.deployementLoading = resData.applicationHealthDetailsLoading;
          this.deploymentApplicationHealth = resData.applicationHealthDetails;
          this.selectedApplicationName = this.deploymentApplicationHealth['applicationName'];
          this.applicationForm.setValue({application: this.selectedApplicationName});
          if (this.deploymentApplicationHealth['error'] != null) {
            this.notifications.showError('Application health Error:', this.deploymentApplicationHealth['error']);
          }
          this.applicationId = this.deploymentApplicationHealth['applicationId'];
          if(this.deploymentApplicationHealth['applicationHealthStatus'].toUpperCase() === 'IN PROGRESS' || this.deploymentApplicationHealth['applicationHealthStatus'].toUpperCase() === 'INPROGRESS'){            
            setTimeout(() => {
              this.getApplicationHelathAndServiceDetails(this.canaryId);
            }, 5000)
          }
        }

        if (resData.serviceInformation != null && resData.isloadedServiceInformation) {
          this.store.dispatch(DeploymentAction.loadedServiceInformation());
          this.deployementLoading = resData.serviceInformationLoading;
          this.deploymentServiceInformation = resData.serviceInformation;
          this.baseLineFileSize = this.humanFileSize(resData.serviceInformation.fileStat.v1FileSize, true);
          this.canaryFileSize = this.humanFileSize(resData.serviceInformation.fileStat.v2FileSize, true);
          if (this.deploymentServiceInformation['error'] != null) {
            this.notifications.showError('Service information Error:', this.deploymentServiceInformation['error']);
          }
          if (this.initializeCanaryList) {
            //this.selectedApplicationName = this.deploymentApplicationHealth['applicationName'];
            if(this.selectedApplicationName  != undefined){
            const d = this.applicationList.find(c => c.applicationName == this.selectedApplicationName);
            this.canaries = d['canaryIdList'].toString().split(",");
            this.canaries.sort();
            this.canaries = [...new Set(this.canaries)];
            this.filteredCanaries = this.control.valueChanges.pipe(
              startWith(''),
              map(value => this._filterCanaries(value))
            );
            }
         }
         this.prepopulateTriggerCanaryForm();
        }

        if (resData.serviceList != null && resData.serviceListLoading) {
          this.store.dispatch(DeploymentAction.restrictExecutionOfServices());
          this.deployementLoading = resData.serviceListLoading;
          this.deploymentServices = resData.serviceList;
          this.serviceListData = this.deploymentServices.services;
          this.serviceListLength = this.deploymentServices.services.length;
          this.renderPage();
          this.tableIsEmpty = false;

          if(this.route.params['_value'].serviceId != null && this.initializeCanaryList){
            const index = this.deploymentServices.services.findIndex(services => services.serviceId == this.route.params['_value'].serviceId);
            this.selectedServiceId = this.deploymentServices.services[index].serviceId;
            this.serviceNameInfo = this.deploymentServices.services[index];
            const serviceObj = this.serviceListData.find(c => c.serviceId == this.route.params['_value'].serviceId);
            this.onClickService(serviceObj);
          }else if(this.serviceIdAfterRerun != undefined && this.serviceIdAfterRerun != null){
            const index = this.deploymentServices.services.findIndex(services => services.serviceId == this.serviceIdAfterRerun);
            this.selectedServiceId = this.deploymentServices.services[index].serviceId;
            this.serviceNameInfo = this.deploymentServices.services[index];
            const serviceObj = this.serviceListData.find(c => c.serviceId == this.serviceIdAfterRerun);
            this.onClickService(serviceObj);
          }
          else{
            if(this.deploymentServices.services != undefined && this.deploymentServices.services.length > 0){
              this.serviceIdExists = true;
            this.selectedServiceId = this.deploymentServices.services[0].serviceId;
            this.serviceNameInfo = this.deploymentServices.services[0];
            this.onClickService(this.deploymentServices.services[0]);
            }else{
              this.serviceIdExists = false;
            }
          }
        } else {
          this.tableIsEmpty = true;
        }
        if (resData.servicesOfApplication != null && resData.isLoadedServicesOfApplication) {
          this.store.dispatch(DeploymentAction.loadedServicesOfApplication());
          this.servicesOfApplication = resData.servicesOfApplication.services;
          
          if(this.servicesOfApplication && this.servicesOfApplication.length > 0){            
            const identifiers = this.logServiceForm.get('identifiers') as FormArray;
            const serviceRow = identifiers.at(0) as FormGroup;    
            serviceRow.patchValue({
              service: this.servicesOfApplication[0].name
            })
            const identifiersm = this.metricServiceForm.get('identifiers') as FormArray;
            const serviceRowm = identifiersm.at(0) as FormGroup;    
            serviceRowm.patchValue({
              service: this.servicesOfApplication[0].name
            })
            
            identifiers.controls[0].get('service').enable();
            identifiers.controls[0].get('baseline').enable();
            identifiers.controls[0].get('canary').enable();
            
            
            identifiersm.controls[0].get('service').enable();
            identifiersm.controls[0].get('baseline').enable();
            identifiersm.controls[0].get('canary').enable();
          }else{
            //disable identifires table when no service available
            const identifiers = this.logServiceForm.get('identifiers') as FormArray;
            identifiers.controls[0].get('service').disable();
            identifiers.controls[0].get('baseline').disable();
            identifiers.controls[0].get('canary').disable();
            
            const identifiersm = this.metricServiceForm.get('identifiers') as FormArray;
            identifiersm.controls[0].get('service').disable();
            identifiersm.controls[0].get('baseline').disable();
            identifiersm.controls[0].get('canary').disable();
          }

        }
        // code related to download logs debug data
        if(resData.downloaddebugDataResponse != null && resData.isLoadedDownloadDebug){
          console.log(resData.downloaddebugDataResponse);
        }
      }
    );

    this.store.select('appDashboard').subscribe(
      (resData) => {
        if(resData.appData != null){
          //console.log(resData.appData);
          this.applications = resData.appData;
        }
      });

      this.store.select('auth').subscribe(
        (response) => {
          if(response.authenticated){            
            this.username = response.user;
          }
        }
      );

  }

checkIfCanaryExists(id){
      if(id == undefined || id == -1 || id == 0){
        this.canaryIdExists = false;
      }else{
        this.canaryIdExists = true;
      }
}

//code while submitting the manual trigger form
serviceListDummy = {
  "oesService": null,
  "autopilotService": [
    {
      "serviceName": "service2qatestgcofc",
      "status": "Fail",
      "finalScore": 0,
      "logsScore": 0,
      "metricsScore": 100,
      "canaryId": 148,
      "serviceId": 166
    },
    {
      "serviceName": "service1qatestdsebg",
      "status": "Fail",
      "finalScore": 0,
      "logsScore": 0,
      "metricsScore": 100,
      "canaryId": 148,
      "serviceId": 165
    }
  ]
};

initializeForms(){
  this.manualTriggerForm = new FormGroup({
    application: new FormControl('',Validators.required),    
    lifetimeHours: new FormControl('', Validators.required),
    beginCanaryAnalysisAfterMins: new FormControl('', Validators.required),
    canaryAnalysisIntervalMins: new FormControl('', Validators.required),  
    minimumCanaryResultScore: new FormControl(),
    //minimumMetricsResultScore: new FormControl(),  
    canaryResultScore: new FormControl(),
    //successMetricsResultScore: new FormControl(),
    baselineStartTimeMs : new FormControl(),
    canaryStartTimeMs : new FormControl()      
  }); 

  this.logServiceForm = new FormGroup({
    identifiers: new FormArray([])
  });

  (<FormArray>this.logServiceForm.get('identifiers')).push(
    new FormGroup({
      service : new FormControl('',Validators.required),
      baseline: new FormControl('',Validators.required),
      canary: new FormControl('',Validators.required)
    })
  );

  this.metricServiceForm = new FormGroup({
    identifiers: new FormArray([])
  });

  (<FormArray>this.metricServiceForm.get('identifiers')).push(
    new FormGroup({
      service : new FormControl('',Validators.required),
      baseline: new FormControl('',Validators.required),
      canary: new FormControl('',Validators.required)
    })
  );
}


addMetricServiceMT(){
  (<FormArray>this.metricServiceForm.get('identifiers')).push(
    new FormGroup({
      service : new FormControl(),
      baseline: new FormControl(),
      canary: new FormControl()
    })
  );
}

deleteMetricService(query,index){
  this.metricServiceForm.controls.identifiers['controls'].splice(index,1);
  this.metricServiceForm.value.identifiers.splice(index, 1);
}

addLogServiceMT(){
  (<FormArray>this.logServiceForm.get('identifiers')).push(
    new FormGroup({
      service : new FormControl(),
      baseline: new FormControl(),
      canary: new FormControl()
    })
  );
}

deleteLogService(query,index){
  this.logServiceForm.controls.identifiers['controls'].splice(index,1);
  this.logServiceForm.value.identifiers.splice(index, 1);
}


  // Below function is use to fetched json from json editor
  showManualTriggerJson(event = null) {
    this.manualTriggerData = this.editor.get();
  }
  
  // Below function is use to save manualTrigger data on click of triggerBtn
  submitManualTriggerData() {
    this.store.dispatch(
      DeploymentAction.manualTriggerData({
        data: this.manualTriggerData,
      })
    );
    if(this.manualTrigerModal !== undefined){
      this.manualTrigerModal.nativeElement.click();
    }
    this.data = {};
  }

  submitManualTriggerForm(){
    if(this.manualTriggerForm.invalid) {
      this.manualTriggerForm.controls.lifetimeHours.markAsUntouched();
      this.manualTriggerForm.controls.lifetimeHours.markAsTouched();
      this.manualTriggerForm.controls.application.markAsUntouched();
      this.manualTriggerForm.controls.application.markAsTouched();
      this.manualTriggerForm.controls.beginCanaryAnalysisAfterMins.markAsUntouched();
      this.manualTriggerForm.controls.beginCanaryAnalysisAfterMins.markAsTouched();
      this.manualTriggerForm.controls.canaryAnalysisIntervalMins.markAsUntouched();
      this.manualTriggerForm.controls.canaryAnalysisIntervalMins.markAsTouched();
      this.manualTriggerForm.controls.canaryStartTimeMs.markAsUntouched();
      this.manualTriggerForm.controls.canaryStartTimeMs.markAsTouched();
      this.manualTriggerForm.controls.baselineStartTimeMs.markAsUntouched();
      this.manualTriggerForm.controls.baselineStartTimeMs.markAsTouched();
      this.manualTriggerForm.controls.minimumCanaryResultScore.markAsUntouched();
      this.manualTriggerForm.controls.minimumCanaryResultScore.markAsTouched();
      this.manualTriggerForm.controls.canaryResultScore.markAsUntouched();
      this.manualTriggerForm.controls.canaryResultScore.markAsTouched();
      return;
    }
   
    if(this.logServiceForm.invalid && this.metricServiceForm.invalid){
      var logArray1= this.logServiceForm.get('identifiers') as FormArray;
      for(var i=0;i<logArray1.length;i++){
        logArray1['controls'][i]['controls'].service.markAsUntouched();
        logArray1['controls'][i]['controls'].service.markAsTouched();
        logArray1['controls'][i]['controls'].baseline.markAsUntouched();
        logArray1['controls'][i]['controls'].baseline.markAsTouched();
        logArray1['controls'][i]['controls'].canary.markAsUntouched();
        logArray1['controls'][i]['controls'].canary.markAsTouched();
      }
      var metricArray1= this.metricServiceForm.get('identifiers') as FormArray;
      for(var i=0;i<metricArray1.length;i++){
        metricArray1['controls'][i]['controls'].service.markAsUntouched();
        metricArray1['controls'][i]['controls'].service.markAsTouched();
        metricArray1['controls'][i]['controls'].baseline.markAsUntouched();
        metricArray1['controls'][i]['controls'].baseline.markAsTouched();
        metricArray1['controls'][i]['controls'].canary.markAsUntouched();
        metricArray1['controls'][i]['controls'].canary.markAsTouched();
      }
      return;
    }


    // let baselineStartTimeMs = this.manualTriggerForm.value.baselineStartTimeMs._d;
    // let canaryStartTimeMs = this.manualTriggerForm.value.canaryStartTimeMs._d;

    let baselineStartTimeMs = this.manualTriggerForm.value.baselineStartTimeMs;
    let canaryStartTimeMs = this.manualTriggerForm.value.canaryStartTimeMs;
    
    var logArray= this.logServiceForm.value.identifiers;
    var logbaselineObj = {};
    for(var i=0;i<logArray.length;i++){
      if(logArray[i].baseline != ""){
        logbaselineObj[logArray[i].service] = logArray[i].baseline;
      }            
    }
    var logcanaryObj = {};
    for(var i=0;i<logArray.length;i++){
      if( logArray[i].canary != ""){
        logcanaryObj[logArray[i].service] = logArray[i].canary;
      }           
    }
    var metricArray= this.metricServiceForm.value.identifiers;
    var metricbaselineObj = {};
    for(var i=0;i<metricArray.length;i++){
      if(metricArray[i].baseline != ""){
        metricbaselineObj[metricArray[i].service] = metricArray[i].baseline;
      }      
    }
    var metriccanaryObj = {};
    for(var i=0;i<metricArray.length;i++){
      if(metricArray[i].canary != ""){
        metriccanaryObj[metricArray[i].service] = metricArray[i].canary;
      }      
    }

    var canaryDeploymentArray = [
      {
        "baseline": {},
        "baselineStartTimeMs": new Date(baselineStartTimeMs).getTime(),
        "canaryStartTimeMs": new Date(canaryStartTimeMs).getTime(),
        "canary": {}
      }
    ];

    if( Object.keys(metricbaselineObj).length > 0 && Object.keys(metriccanaryObj).length > 0){
      canaryDeploymentArray[0].baseline['metric'] = metricbaselineObj;
      canaryDeploymentArray[0].canary['metric'] = metriccanaryObj;
    }

    if( Object.keys(logbaselineObj).length > 0 && Object.keys(logcanaryObj).length > 0){
      canaryDeploymentArray[0].baseline['log'] = logbaselineObj;
      canaryDeploymentArray[0].canary['log'] = logcanaryObj;
    }

    
    
    this.manualTriggerData =    {
      "application": this.manualTriggerForm.value.application,
      "isJsonResponse": true,
      "canaryConfig": {
        "canaryAnalysisConfig": {
          "beginCanaryAnalysisAfterMins": this.manualTriggerForm.value.beginCanaryAnalysisAfterMins,
          "canaryAnalysisIntervalMins": this.manualTriggerForm.value.canaryAnalysisIntervalMins,
          "notificationHours": []
        },
        "canaryHealthCheckHandler": {
          "minimumCanaryResultScore": this.manualTriggerForm.value.minimumCanaryResultScore,
          //"minimumMetricsResultScore": this.manualTriggerForm.value.minimumMetricsResultScore,
        },
        "canarySuccessCriteria": {
          "canaryResultScore": this.manualTriggerForm.value.canaryResultScore,
          //"successMetricsResultScore": this.manualTriggerForm.value.successMetricsResultScore,
        },
        "combinedCanaryResultStrategy": "AGGREGATE",
        "lifetimeHours": this.manualTriggerForm.value.lifetimeHours,
        "name": this.username
      },
      "canaryDeployments": canaryDeploymentArray
    };
    this.submitManualTriggerData();

  }

  // Below function is execute on click of Form or Editor tab.
  onManualTriggerClickTab(event) {
    if (event.target.id === 'manualTrigger-form-tab') {
      this.selectedManualTriggerTab = "manualTrigger-form-tab";      
    } else if (event.target.id === 'manualTrigger-editor-tab') {
      this.selectedManualTriggerTab = "manualTrigger-editor-tab";
    }
  }

  onChangeApplicationManualTrigger(applicationListIndex){
    const applicationId  = this.deployementApplications[applicationListIndex - 1].applicationId;
    this.store.dispatch(DeploymentAction.fetchServicesOfApplication({applicationId : applicationId}));
  }

  // code for application dropdown display starts here

  onSelectionChangeApplication(event) {
    this.showSearch=false;
    if (this.deploymentApplicationHealth['analysisType'] == "Logs and Metrics" || this.deploymentApplicationHealth['analysisType'] == "Logs Only") {
          this.selectedTab = 'log-analysis';
          this.onClickTab('log-analysis-tab');
        } else if(this.deploymentApplicationHealth['analysisType'] == "Metrics Only") {
          this.selectedTab = 'metric-analysis';
          this.onClickTab('metric-analysis-tab');
        }
    // this.selectedTab = 'log-analysis'
    this.initializeCanaryList = false;
    this.canaries = [];
    this.selectedApplicationName = event;
    const d = this.applicationList.find(c => c.applicationName == this.selectedApplicationName);
    if(d['canaryIdList'] != undefined){
        if (d['canaryIdList'].length === 0) {
          this.canaries = [];
          this.control.setValue('');
          this.notifications.showError(this.selectedApplicationName, 'No Canaries found for the Selected Application');
        } else {
          this.canaries = d['canaryIdList'].toString().split(",");
          this.canaries.sort();
          this.canaries = [...new Set(this.canaries)];
          this.filteredCanaries = this.control.valueChanges.pipe(
            startWith(''),
            map(value => this._filterCanaries(value))
          );
          let selectedCan = this.canaries.map(parseFloat).sort();
          if (this.control.value != Math.max.apply(null, selectedCan)) {
            this.control.setValue(Math.max.apply(null, selectedCan));
          }
          this.canaryId = Math.max.apply(null, selectedCan);
          this.getApplicationHelathAndServiceDetails(Math.max.apply(null, selectedCan));
        }
    }
  }

  //code for change the canary

  onSelectionChangeCanaryRun(canary) {
    this.control.setValue(canary);
    this.canaryId = canary;
    this.checkIfCanaryExists(this.canaryId);  // to check if canary exists or not
    this.getApplicationHelathAndServiceDetails(canary);
    //this.onClickService(this.deploymentServices.services[0]);

  }

  // build application form

  buildApplicationForm() {
    this.applicationForm = this.fb.group({
      application: [''],
    });

  }

  // function to filter applications
  filterApplications(applicationName: string): any[] {
    return this.applicationList.filter(option => option.applicationName.toLowerCase().indexOf(applicationName.toLowerCase()) === 0);
  }

  // initialization application filter

  initFilterApplication() {
    this.applicationListOptions = this.applicationForm
      .get('application')
      .valueChanges.pipe(
        startWith<string | any>(''),
        map(val => (typeof val === 'string' ? val : val.applicationName)),
        map(applicationName => (applicationName ? this.filterApplications(applicationName) : this.applicationList.slice()))
      );
  }

  // code for application dropdown display ends here

  // filter for canaries
  private _filterCanaries(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.canaries.filter(canaryId => this._normalizeValue(canaryId).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value;
  }

  // function to increment canary runs

  incrementCanaryRun(max: any) {
    this.defaultServiceId = false;
    this.canaries.sort();
    this.canaryList = this.canaries;
    var length = this.canaryList.length;
    var index = this.canaryList.findIndex(cid => cid == max);
    if (index === length - 1) {
      this.decrementDisable = false;
      this.incredementDisable = true;
    } else {
      this.decrementDisable = false;
      this.incredementDisable = false;
    }

    if (index != -1) {
      if (index === length - 1) {
        this.incredementDisable = true;

      } else {
        if (this.route.params['_value'].canaryId != null) {
          this.control.setValue(this.canaryList[index + 1]);

        } else {
          this.store.dispatch(DeploymentAction.updateCanaryRun({ canaryId: this.canaryList[index + 1] }));
          this.control.setValue(this.canaryList[index + 1]);
        }
        this.getApplicationHelathAndServiceDetails(Number(this.canaryList[index + 1]));
      }
    }
  }

  // function to decrement canary runs

  decrementCanaryRun(min: any) {
    this.defaultServiceId = false;
    this.incredementDisable = false;
    this.canaries.sort();
    this.canaryList = this.canaries;
    var length = this.canaryList.length;
    var index = this.canaryList.findIndex(cid => cid == min);
    if (index === 0) {
      this.decrementDisable = true;
      this.incredementDisable = false;
    } else {
      this.decrementDisable = false;
      this.incredementDisable = false;
    }

    if (index != -1 && index != 0) {
      if (this.route.params['_value'].canaryId != null) {
        this.control.setValue(this.canaryList[index - 1]);
      } else {
        this.store.dispatch(DeploymentAction.updateCanaryRun({ canaryId: this.canaryList[index - 1] }));
        this.control.setValue(this.canaryList[index - 1]);
      }

      this.getApplicationHelathAndServiceDetails(Number(this.canaryList[index - 1]));

    } else if (index === 0) {
      this.control.setValue(this.canaryList[index]);
    }
  }

  //on click of service
  onClickService(item: any) {    
    
    this.defaultServiceId = true;
    this.selectedServiceId = item.serviceId;
    this.serviceNameInfo = item;
    this.selectedServiceId = item.serviceId;
    this.statusOfSelectedService = item.status;

    //code to reset the serviceId after reclassification flow
    this.serviceIdAfterRerun = null;
    
    // Below logic is use to fetch initiall selected tab

    if(this.selectedTab == ''){
      if (item['analysisType'] != undefined) {
        if (item['analysisType'].includes('Logs and Metrics')) {
          this.selectedTab = 'log-analysis';
          this.onClickTab('log-analysis-tab');
        } else if (item['analysisType'].includes('Logs')) {
          this.selectedTab = 'log-analysis';
          this.onClickTab('log-analysis-tab');
        } else {
          this.selectedTab = 'metric-analysis';
          this.onClickTab('metric-analysis-tab');
        }
      }
    }else{
      if(item['analysisType'] == 'Logs Only' || item['analysisType'] == 'Logs and Metrics'){
        this.onClickTab('log-analysis-tab');
      }else if(item['analysisType'] == 'Metrics Only'){
        this.onClickTab('metric-analysis-tab');
      }
    }


    if (this.selectedServiceId != null || this.selectedServiceId != undefined) {
      this.store.dispatch(DeploymentAction.loadServiceInformation({ canaryId: this.control.value, serviceId: item.serviceId }));
    }

    
  }

  //code for application list display starts here
  displayFn(user: User): string {
    return user && user.applicationName ? user.applicationName : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.applicationName.toLowerCase().indexOf(filterValue) === 0);
  }

  onTogglePosition(position: string) {
    this.nav_position = position === 'start' ? 'end' : 'start';

  }

  // Below function is use to hide sidenav
  hideSidenav() {
    this.Sidenav.close();
  }

  getOverallInfo() {
    $("[data-toggle='tooltip']").tooltip('hide');
    this.isShow = !this.isShow;
  }

  // get latest canary run
  getLatestRun() {
    this.store.dispatch(DeploymentAction.loadLatestRun());
    this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
      (resData) => {
        if (resData.canaryId != null) {
          this.canaryId = resData.canaryId;
          this.checkIfCanaryExists(this.canaryId); // to check if canary exists or not
          this.deployementLoading = resData.deployementLoading;
          if (this.latestCanaryCounter === 1) {
            this.deployementRun = resData.canaryId;
            this.control.setValue(resData.canaryId);
            this.store.dispatch(DeploymentAction.updateCanaryRun({ canaryId: resData.canaryId }));
          }
          this.latestCanaryCounter++;
          this.control.setValue(resData.canaryId);

        }
      }
    );

  }

  // get application details

  getAllApplications() {
    this.store.dispatch(DeploymentAction.loadApplications());
    this.buildApplicationForm();
    this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
      (resData) => {
        if (resData.applicationList == null || resData.applicationList == undefined || resData.applicationList == []) {
          this.applicationExists = false;
        }else{
          this.applicationExists = true;
        }
        if (resData.applicationList != null) {
          this.deployementLoading = resData.applicationListLoading;
          this.deployementApplications = resData.applicationList;
          this.applicationList = resData.applicationList;
          this.initFilterApplication();
          if (this.initializeCanaryList) {
            if(this.route.params['_value'].applicationName != null && !this.manualTriggerLatestRun){
              this.selectedApplicationName = this.route.params['_value'].applicationName;
              const d = this.applicationList.find(c => c.applicationName == this.selectedApplicationName);
              this.canaries = d['canaryIdList'].toString().split(",");
              this.canaries.sort();
              this.canaries = [...new Set(this.canaries)];
              this.filteredCanaries = this.control.valueChanges.pipe(
                startWith(''),
                map(value => this._filterCanaries(value))
              );
            }
        
      }
        }
      }
    );
  }

  // Below function is used if user want to refresh list data
  refreshList() {
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(DeploymentAction.loadServices({ canaryId: this.control.value }));
  }

  //Below function is execute on search
  onSearch() {
    if (this.searchData != '') {
      this.currentPage = [];
      for (let i = 0; i < this.serviceListLength; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    } else {
      this.renderPage();
    }
  }

  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if (this.page.endPoint < this.serviceListLength - 1) {
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    } else {
      for (let i = this.page.startingPoint; i < this.serviceListLength; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    }
  }

  //Below function is execute on change of perPage dropdown value
  onChangePerPageData() {
    this.page.pageSize = +this.perPageData;
    if ((this.page.startingPoint + this.page.pageSize) < this.serviceListLength) {
      this.page.endPoint = this.page.startingPoint + this.page.pageSize;
    } else {
      this.page.endPoint = this.serviceListLength;
    }
    this.renderPage();
  }

  //Below function is execute on click of page next btn
  pageNext() {
    if (this.page.endPoint < this.serviceListLength - 1) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.serviceListLength) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.serviceListLength) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.serviceListLength - 1;
      }
      this.renderPage();
    }
  }

  //Below function is execute on click of page prev btn
  pagePrev() {
    if (this.page.startingPoint != 0) {
      this.page.pageNo -= 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.startingPoint - this.page.pageSize) > 0) {
        this.page.startingPoint -= this.page.pageSize;
        this.page.endPoint = this.page.startingPoint + this.page.pageSize;
      } else if ((this.page.startingPoint - this.page.pageSize) >= 0) {
        this.page.startingPoint = 0;
        this.page.endPoint = this.page.pageSize;
      }
      this.renderPage();
    }
  }

  //Below function is executes on click of page btn exist in pagination
  showPage(currentPage) {
    this.page.pageNo = currentPage;
    this.page.startingPoint = (currentPage - 1) * this.page.pageSize;
    if (currentPage * this.page.pageSize < this.serviceListLength) {
      this.page.endPoint = currentPage * this.page.pageSize;
    } else {
      this.page.endPoint = this.serviceListLength - 1;
    }
    this.renderPage();
  }

  // function to convert filedata in size
  humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
  }

  // Below function is execute on click of log or metric Analysis tab.
  onClickTab(event) {
    if (event === 'log-analysis-tab') {
      this.selectedTab = 'log-analysis';
      setTimeout(() => {
        if(this.isRerunLogs != undefined){
          this.isRerunLogs = false;
        }
      }, 5000)
      
    } else if (event === 'metric-analysis-tab') {
      this.selectedTab = 'metric-analysis';
    }
    else {
      this.selectedTab = 'correlation';
    }

  }

 
  // below code use to call get services list and application health info

  getApplicationHelathAndServiceDetails(runId: number) {

    // default selection of canary id
    this.control.setValue(runId);
    this.store.dispatch(DeploymentAction.loadServices({ canaryId: runId }));
    this.store.dispatch(DeploymentAction.loadApplicationHelath({ canaryId: runId }));
  }


  // Below fuction is use to cancel the running canary

  cancelRunningCanary(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, stop the analysis!',
    }).then((result) => {
      if (result.value) {
        $("[data-toggle='tooltip']").tooltip('hide');

        this.autopilotService.cancelCanaryRun(id).subscribe((res: any) => {
          this.cancelRunningCanaryData = res;
          this.notifications.showSuccess('', res['message']);
        },
          (error) => {
            this.notifications.showError('', error);
          })

      } else {

      }
    })
  }


  // code for calculating difference in time
  calculateDiff(dateFuture) {
    var date2: any = new Date();

    let diffInMilliSeconds = Math.abs(dateFuture - date2) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = '';
    if (days > 0) {
      difference += (days === 1) ? `${days}d ` : `${days}d `;
    }

    difference += (hours === 0 || hours === 1) ? `${hours}h ` : `${hours}h `;

    difference += (minutes === 0 || hours === 1) ? `${minutes}m ago` : `${minutes}m ago`;

    return difference;
  }

  // for getting reclassification history data
  getReclassifiactionHistory() {
    this.store.dispatch(DeploymentAction.fetchReclassificationHistoryData({ logTemplateName: this.deploymentServiceInformation['logTemplateName'], canaryId: this.canaryId, serviceId: this.selectedServiceId }));
  }

  //function executes when a rerun happen from log-analysis component
  getlogAnalysisData(serviceIdFromChild) {
    this.serviceIdAfterRerun = serviceIdFromChild;
    this.onSelectionChangeCanaryRun(this.canaryId);
    this.isRerunLogs = true;
  }

  getEventsFromLogAnalysis(event){
    if(event){
      this.Sidenav.close();
      this.isShow = false;
    }   
  }
  showSearchFunc(){
    this.showSearch=true;
    this.applicationForm.setValue({application: ''});
  }

  prepopulateTriggerCanaryForm(){
    if(this.deployementApplications){
      var applicationIndex = this.deployementApplications.findIndex(x => x.applicationName == this.selectedApplicationName); 
      this.onChangeApplicationManualTrigger(applicationIndex+1); 
    }
    this.manualTriggerForm.setValue({
      application : this.selectedApplicationName,
      beginCanaryAnalysisAfterMins: this.deploymentServiceInformation['beginCanaryAnalysisAfterMins'],
      canaryAnalysisIntervalMins : this.deploymentServiceInformation['canaryAnalysisIntervalMins'],
      lifetimeHours: this.deploymentServiceInformation['lifetimeInHours'],
      minimumCanaryResultScore: this.deploymentServiceInformation['minimumCanaryResultScore'],
      //minimumMetricsResultScore: new FormControl(),  
      canaryResultScore: this.deploymentServiceInformation['canaryResultScore'],
      //successMetricsResultScore: new FormControl(),
      baselineStartTimeMs : new Date(this.deploymentServiceInformation['v1StartTime']),
      canaryStartTimeMs : new Date(this.deploymentServiceInformation['v2StartTime'])
    });
    // this.manualTriggerForm.setValue({
    //     canaryStartTimeMs : new Date(this.deploymentServiceInformation['v2StartTime']),
    //     baselineStartTimeMs : new Date(this.deploymentServiceInformation['v1StartTime']),
    //   });
  }

  // download logs data
  downloadDebugData(id){
    this.store.dispatch(DeploymentAction.downloadDebugData({canaryId: id}));
  }
}
