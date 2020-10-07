import { JsonEditorComponent, JsonEditorOptions } from "ang-jsoneditor";
import { Component, OnInit, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
// platform-service-ui change
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';
import { FormControl } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as fromFeature from './store/feature.reducer';
import * as fromApp from '../../store/app.reducer';
import * as DeploymentAction from './store/deploymentverification.actions';
import * as MetricAnalysisActions from './metric-analysis/store/metric-analysis.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { MatSidenav } from '@angular/material/sidenav';
import Swal from 'sweetalert2';

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
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
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
  selectedTab = '';                                 // this variable is use to store value of selected tab.

  ///code for showing select application shows here
  myControl = new FormControl();
  options: User[] = [];
  filteredOptions: Observable<User[]>;
  isShow = true;
  deployementApplications: any;
  deploymentServices: any;
  deploymentApplicationHealth = {};
  deploymentServiceInformation = {};

  // App form initia

  applicationList = [];

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
  checkCanaryId: boolean = true;
  defaultServiceId: boolean = false;
  initializeCanaryList: boolean = true;


  serviceIdAfterRerun: any = null;     //variable used to set service Id from child component log analysis after rerun
  manualTriggerLatestRun: number;
  isRerunLogs : boolean = false;
  serviceIdFromChild :any = null;

  // App form end

  constructor(private route: ActivatedRoute, public sharedService: SharedService, public store: Store<fromFeature.State>,
    public autopilotService: AutopiloService, public notifications: NotificationService, public appStore: Store<fromApp.AppState>,
    private fb: FormBuilder) {
  }

  // Below function is use to capture events occur in matric analysis component and make responsive to table.
  @HostListener('window:click', ['$event'])
  handleClick(target) {
    const targetnode = target.target;
    if (targetnode.textContent === 'Log Analysis' ||
      targetnode.textContent === 'Metric Analysis' ||
      targetnode.classList['value'] === 'service-selection') {
      this.Sidenav.close();
      this.isShow = false;
    }
  }



  ngOnInit(): void {

    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.selectedManualTriggerTab = 'manualTrigger-editor-tab'; //setting default tab selected as form

    // hide tooltip 
    $("[data-toggle='tooltip']").tooltip('hide');
    this.selectedTab = '';
    this.getAllApplications();

    if (this.route.params['_value'].applicationName != null && this.route.params['_value'].canaryId != null) {
      this.canaryId = this.route.params['_value'].canaryId;
      this.canaryId = Number(this.route.params['_value'].canaryId);
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
        }

        if (resData.applicationHealthDetails != null) {
          this.deployementLoading = resData.applicationHealthDetailsLoading;
          this.deploymentApplicationHealth = resData.applicationHealthDetails;
          this.selectedApplicationName = this.deploymentApplicationHealth['applicationName'];
          if (this.deploymentApplicationHealth['error'] != null) {
            this.notifications.showError('Application health Error:', this.deploymentApplicationHealth['error']);
          }
          this.applicationId = this.deploymentApplicationHealth['applicationId'];
         
        }

        if (resData.serviceInformation != null) {
          this.deployementLoading = resData.serviceInformationLoading;
          this.deploymentServiceInformation = resData.serviceInformation;
          this.baseLineFileSize = this.humanFileSize(resData.serviceInformation.fileStat.v1FileSize, true);
          this.canaryFileSize = this.humanFileSize(resData.serviceInformation.fileStat.v2FileSize, true);
          if (this.deploymentServiceInformation['error'] != null) {
            this.notifications.showError('Service information Error:', this.deploymentServiceInformation['error']);
          }
          if (this.initializeCanaryList) {
            //this.selectedApplicationName = this.deploymentApplicationHealth['applicationName'];
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
            this.selectedServiceId = this.deploymentServices.services[0].serviceId;
            this.serviceNameInfo = this.deploymentServices.services[0];
            this.onClickService(this.deploymentServices.services[0]);
          }
        } else {
          this.tableIsEmpty = true;
        }
      }
    );

  }


  //code while submitting the manual trigger form

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
  }

  // Below function is execute on click of Form or Editor tab.
  onManualTriggerClickTab(event) {
    if (event.target.id === 'manualTrigger-form-tab') {
      this.selectedManualTriggerTab = "manualTrigger-form-tab";
    } else if (event.target.id === 'manualTrigger-editor-tab') {
      this.selectedManualTriggerTab = "manualTrigger-editor-tab";
    }
  }

  // code for application dropdown display starts here

  onSelectionChangeApplication(event) {
    this.initializeCanaryList = false;
    this.canaries = [];
    this.selectedApplicationName = event;
    const d = this.applicationList.find(c => c.applicationName == this.selectedApplicationName);
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

  //code for change the canary

  onSelectionChangeCanaryRun(canary) {
    this.control.setValue(canary);
    this.canaryId = canary;
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
    
    if(this.manualTriggerLatestRun != null){
     // this.selectedApplicationName = 
      this.getAllApplications();
    }


    this.defaultServiceId = true;
    this.selectedServiceId = item.serviceId;
    this.serviceNameInfo = item;
    this.selectedServiceId = item.serviceId;

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
      if(this.selectedTab == 'log-analysis'){
        this.onClickTab('log-analysis-tab');
      }else if(this.selectedTab == 'metric-analysis'){
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
    this.store.dispatch(DeploymentAction.fetchReclassificationHistoryData({ logTemplateName: this.deploymentApplicationHealth['logTemplateName'], canaryId: this.canaryId, serviceId: this.selectedServiceId }));
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
}
