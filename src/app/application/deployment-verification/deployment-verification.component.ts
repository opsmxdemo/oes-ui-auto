import { Component, OnInit, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
// platform-service-ui change
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';
import {FormControl} from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as fromFeature from './store/feature.reducer';
import * as DeploymentAction from './store/deploymentverification.actions';
import * as MetricAnalysisActions from './metric-analysis/store/metric-analysis.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { MatSidenav } from '@angular/material/sidenav';



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

  size = 5343454545;
  applicationForm: FormGroup;
  deployementRun: any;
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

  applicationList = [
    { applicationName: '' }
  ];

  applicationListOptions: Observable<any[]>;
  applicationId: any;
  selectedApplicationName: any;
  canaryId: any[];
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

  // App form end

   constructor(private route: ActivatedRoute ,public sharedService: SharedService, public store: Store<fromFeature.State>,
    public autopilotService: AutopiloService, public notifications: NotificationService,
    private fb: FormBuilder) { 
    }

   // Below function is use to capture events occur in matric analysis component and make responsive to table.
   @HostListener('window:click', ['$event'])
     handleClick(target){
       const targetnode = target.target;
      if(targetnode.textContent === 'Log Analysis' ||
        targetnode.textContent === 'Metric Analysis' || 
        targetnode.classList['value'] === 'service-selection'){
          this.Sidenav.close();
          this.isShow = false;
      }
    }

// code for application dropdown display starts here

  onSelectionChangeApplication(event) {
    
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
      if(this.control.value != Math.max.apply(null, selectedCan)) {
        this.store.dispatch(DeploymentAction.updateCanaryRun({canaryId: Math.max.apply(null, selectedCan)}));
      }
            
      this.store.dispatch(DeploymentAction.loadServices({ canaryId: Math.max.apply(null, selectedCan) }));
      this.store.dispatch(DeploymentAction.loadApplicationHelath({ canaryId: Math.max.apply(null, selectedCan)}));
      if(this.selectedServiceId !== undefined){
        this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: Math.max.apply(null, selectedCan), serviceId: this.selectedServiceId !== undefined?this.selectedServiceId:null }));
      }
    }
  }
  //code for change the canary
  onSelectionChangeCanaryRun(canary) {
    // this.canaries.sort();
    // this.canaryList = this.canaries;
    // var length = this.canaryList.length;
    this.store.dispatch(DeploymentAction.updateCanaryRun({canaryId: canary}));
    
    // this.filteredCanaries = this.control.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterCanaries(value))
    // );
    this.store.dispatch(DeploymentAction.loadServices({ canaryId: canary}));
    this.store.dispatch(DeploymentAction.loadApplicationHelath({ canaryId:canary}));
    if(this.selectedServiceId !== undefined){
      this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: canary, serviceId: this.selectedServiceId !== undefined ? this.selectedServiceId : null }));
    }
  }

    buildApplicationForm() {
      this.applicationForm = this.fb.group({
        application: [this.selectedApplicationName],
      });
      
    }
  
    filterApplications(applicationName: string): any[] {
      return this.applicationList.filter(option => option.applicationName.toLowerCase().indexOf(applicationName.toLowerCase()) === 0);
    }
    
  
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



    
  ngOnInit(): void {
     // hide tooltip 
     $("[data-toggle='tooltip']").tooltip('hide');
    this.getAllApplications();
    this.getApplicationHealth();
    if(this.route.params['_value'].canaryId != null){
      this.control.setValue(this.route.params['_value'].canaryId);
      this.store.dispatch(DeploymentAction.loadServices({ canaryId: this.route.params['_value'].canaryId }));
      this.store.dispatch(DeploymentAction.loadApplicationHelath({ canaryId: this.route.params['_value'].canaryId}));
    }else{
      this.getLatestRun();
    }
    
    this.getAllServices();
    this.getServiceInformation();
 
    if (this.canaries.length > 0) {
      this.filteredCanaries = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCanaries(value))
      );
    }
  }

  incrementCanaryRun(max: any) {
    this.canaries.sort();
    this.canaryList = this.canaries;
    var length = this.canaryList.length;
    var index = this.canaryList.findIndex(cid => cid == max);
    if (index  === length - 1) {
      this.decrementDisable = false;
      this.incredementDisable = true;
    } else {
      this.decrementDisable = false;
      this.incredementDisable = false;
    }

    if (index !== -1) {
      if (index  === length - 1) {
        this.incredementDisable = true;
    
      } else {
    
        this.store.dispatch(DeploymentAction.updateCanaryRun({canaryId: this.canaryList[index + 1]}));
        this.store.dispatch(DeploymentAction.loadServices({canaryId: this.canaryList[index + 1]}));
        this.store.dispatch(DeploymentAction.loadApplicationHelath({canaryId: this.canaryList[index + 1]}));
        if(this.selectedServiceId !== undefined){
          this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: this.canaryList[index + 1], serviceId: this.selectedServiceId !== undefined ? this.selectedServiceId : null }));
        }
      } 
    }
  }
  decrementCanaryRun(min: any) {
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

    if (index !== -1 && index !== 0) {
      this.store.dispatch(DeploymentAction.updateCanaryRun({canaryId: this.canaryList[index - 1]}));
       this.store.dispatch(DeploymentAction.loadServices({canaryId: this.canaryList[index - 1]}));
       this.store.dispatch(DeploymentAction.loadApplicationHelath({canaryId: this.canaryList[index - 1]}));
       if(this.selectedServiceId !== undefined){
        this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: this.canaryList[index - 1], serviceId: this.selectedServiceId !== undefined ? this.selectedServiceId : null }));
       }
    } else if (index === 0) {
      this.control.setValue(this.canaryList[index]);
    }
  }


  //on click of service
  getService(item: any) {
    this.selectedServiceId = item.serviceId;
    this.serviceNameInfo = item;
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
  hideSidenav(){
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
        if (resData.canaryRun !== null) {
          this.deployementLoading = resData.deployementLoading;
          this.deployementRun = resData.canaryRun;
          this.control.setValue(resData.canaryRun);

        //this.control = new FormControl(resData.canaryRun);
          if (this.counter === 1) {
            this.store.dispatch(DeploymentAction.loadServices({ canaryId: resData.canaryRun }));
            this.store.dispatch(DeploymentAction.loadApplicationHelath({ canaryId: resData.canaryRun}));
            this.counter++;
          }
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
        if (resData.applicationList !== null) {
          this.deployementLoading = resData.applicationListLoading;
          this.deployementApplications = resData.applicationList;
          this.applicationList = resData.applicationList;
          this.initFilterApplication();
        }
      }
    );
  }

    //code for pagination of services list
  // Below function is used if user want to refresh list data
  refreshList() {
     this.store.dispatch(DeploymentAction.loadServices({ canaryId: this.control.value}));
  } 
    //Below function is execute on search
  onSearch(){
    if(this.searchData !== ''){
      this.currentPage = [];
      for (let i = 0; i < this.serviceListLength; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    }else{
      this.renderPage();
    }
  }

  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if(this.page.endPoint < this.serviceListLength-1){
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    }else{
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
    if (this.page.endPoint < this.serviceListLength-1) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.serviceListLength) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.serviceListLength) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.serviceListLength-1;
      }
      this.renderPage();
    }
  }

  //Below function is execute on click of page prev btn
  pagePrev() {
    if (this.page.startingPoint !== 0) {
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
      this.page.endPoint = this.serviceListLength-1;
    }
    this.renderPage();
  }


    // get service  details
    getAllServices(){
      this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
        (resData) => {
          if(resData.serviceList !== null){
                  this.deployementLoading = resData.serviceListLoading;
                  this.deploymentServices = resData.serviceList;
                  this.serviceListData = this.deploymentServices.services;
                  this.serviceListLength = this.deploymentServices.services.length;  
                  this.renderPage();
                  this.tableIsEmpty = false;
                  this.selectedServiceId = this.deploymentServices.services[0].serviceId;
                  this.serviceNameInfo = this.deploymentServices.services[0];   
                  if (this.serviceConter === 1 && this.selectedServiceId !== undefined) {
                    this.store.dispatch(DeploymentAction.loadServiceInformation({ canaryId: resData.canaryRun, serviceId: this.selectedServiceId}));
                    this.serviceConter++;
                  }
                   // Below we are dispatching action of metric analysis to load initial data of metric analysis tab if metric is exist in application.
                   if(this.deploymentApplicationHealth['analysisType'].includes('Metrics')){
                    this.store.dispatch(MetricAnalysisActions.loadMetricAnalysis({canaryId:this.control.value,serviceId:this.selectedServiceId}));
                  } 
            
             }else{
               this.tableIsEmpty = true;
             }
            
        }
               
      );
    }

    // get application health details
    getApplicationHealth(){
      this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
        (resData) => {
          if(resData.applicationHealthDetails !== null){
                  this.deployementLoading = resData.applicationHealthDetailsLoading;
                  this.deploymentApplicationHealth = resData.applicationHealthDetails;
                  this.selectedApplicationName = this.deploymentApplicationHealth['applicationName'];
                  if(this.deploymentApplicationHealth['error'] != null){
                    this.notifications.showError('Application health Error:', this.deploymentApplicationHealth['error']);
                  }
                  if(this.route.params['_value'].applicationName != null){
                    this.applicationForm = this.fb.group({
                      application: [this.route.params['_value'].applicationName],
                    });
                  }else{
                    this.applicationForm = this.fb.group({
                      application: [this.selectedApplicationName],
                    });
                  }
                    this.applicationId = this.deploymentApplicationHealth['applicationId'];

                    // Below logic is use to fetch initiall selected tab
                    if(this.deploymentApplicationHealth['analysisType'].includes('Logs and Metrics')){
                      if(this.selectedTab === ''){
                        this.selectedTab = 'log-analysis';
                      }
                    }else if(this.deploymentApplicationHealth['analysisType'].includes('Logs')){
                      this.selectedTab = 'log-analysis';
                    }else {
                      this.selectedTab = 'metric-analysis';
                    }
                 
             }
             if(this.canaryCheckCounter === 1 && this.selectedApplicationName != null){
              this.onSelectionChangeApplication(this.selectedApplicationName);
              this.canaryCheckCounter ++;
            }
        }
      );
    }

    // get service information
    getServiceInformation(){
      this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
        (resData) => {
          if(resData.serviceInformation !== null){
                  this.deployementLoading = resData.serviceInformationLoading;
                  this.deploymentServiceInformation = resData.serviceInformation;
                  this.baseLineFileSize = this.humanFileSize(resData.serviceInformation.fileStat.v1FileSize,true);
                  this.canaryFileSize = this.humanFileSize(resData.serviceInformation.fileStat.v2FileSize,true);
                  if(this.deploymentServiceInformation['error'] != null){
                    this.notifications.showError('Service information Error:', this.deploymentServiceInformation['error']);
                  }
             }
        }
      );
    }

    // function to convert filedata in size
    humanFileSize(bytes, si=false, dp=1) {
      const thresh = si ? 1000 : 1024;
    
      if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
      }
    
      const units = si 
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      let u = -1;
      const r = 10**dp;
    
      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    
    
      return bytes.toFixed(dp) + ' ' + units[u];
    }

  // Below function is execute on click of log or metric Analysis tab.
  onClickTab(event){
    if(event.target.id === 'log-analysis-tab'){
      this.selectedTab = 'log-analysis';
    } else if(event.target.id === 'metric-analysis-tab') {
      this.selectedTab = 'metric-analysis';
    }
  }

  // Below function is use to hide sidenav if click happen in Analysis section.
  onClickAnalysisSection(event){
    if(event.target.id !== 'expColBtn'){
      this.Sidenav.close();
      this.isShow = false;
    }
  }

 // code for calculating difference in time
  calculateDiff(dateFuture) {
      var date2:any = new Date();

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
  
}
