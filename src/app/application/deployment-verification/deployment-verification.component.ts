import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';
import {FormControl} from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as fromFeature from './store/feature.reducer';
import * as deploymentApp from './store/deploymentverification.reducer';
import * as DeploymentAction from './store/deploymentverification.actions';
import * as AppOnboardingAction from '../../application-onboarding/store/onBoarding.actions';
import * as LayoutAction from '../../layout/store/layout.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { NumberLiteralType } from 'typescript';



export interface User {
  applicationName: string;
  id: any;
}

@Component({
  selector: 'app-deployment-verification',
  templateUrl: './deployment-verification.component.html',
  styleUrls: ['./deployment-verification.component.less']
})
export class DeploymentVerificationComponent implements OnInit {
  
  applicationForm: FormGroup;
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
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
  
  ///code for showing select application shows here
  myControl = new FormControl();
  options: User[] = [];
  filteredOptions: Observable<User[]>;
  isShow = true;
  deployementApplications: any;
  deploymentServices: any;
  deploymentApplicationHealth: any;
  deploymentServiceInformation: any;

 // App form initia

  applicationList = [
    { applicationName: '' }
  ];

  applicationListOptions: Observable<any[]>;
  applicationId: any;
  selectedApplicationName: any;
  canaryId: any[];
  serviceNameInfo: any;

  //pagination for service table
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.
  serviceListData: any;
  selectedServiceId: number;                                              // It use to store Accountlist data fetched from state.
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

 //code for pie chart
  view: any[] = [230, 150];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: string = "bottom";
  pieData: any;
  colorScheme = {
    domain: ["#A10A28","#C7B42C","#5AA454",  "#AAAAAA"]
  }

  // App form end

   constructor(public sharedService: SharedService, public store: Store<fromFeature.State>,
    public autopilotService: AutopiloService, public notifications: NotificationService,
    private fb: FormBuilder) { 
    }

// code for application dropdown display starts here

  onSelectionChangeApplication(event) {
    
    this.canaries = [];
    this.selectedApplicationName = event.option.value;
    const d = this.applicationList.find(c => c.applicationName == this.selectedApplicationName);
    if (d['canaryIdList'].length === 0) {
      this.canaries = [];
      this.control.setValue('');
      this.notifications.showError(this.selectedApplicationName, 'No Canaries found for the Selected Application');
    } else {
      this.canaries = d['canaryIdList'].toString().split(",");
      this.canaries.sort();
      console.log('canaries list:::' + this.canaries);
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
      this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: Math.max.apply(null, selectedCan), serviceId: this.selectedServiceId }));

    }
  }
  //code for change the canary
  onSelectionChangeCanaryRun(canary) {
    this.store.dispatch(DeploymentAction.updateCanaryRun({canaryId: canary}));
    this.filteredCanaries = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCanaries(value))
    );
    this.store.dispatch(DeploymentAction.loadServices({ canaryId: canary}));
    this.store.dispatch(DeploymentAction.loadApplicationHelath({ canaryId:canary}));
    this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: canary, serviceId: this.selectedServiceId }));
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
    console.log(value);
    return value;
  }



    
  ngOnInit(): void {
    this.getApplicationHealth();
    this.getLatestRun();
    this.getAllApplications();
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
    console.log(this.canaryList, max);
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
        this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: this.canaryList[index + 1], serviceId: this.selectedServiceId }));

      } 
    }
  }
  decrementCanaryRun(min: any) {
    console.log("SSS:::" + min +"DDD"+ this.control.value);
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

      console.log('MINNNNNN::'+this.canaryList[index - 1]);
       this.store.dispatch(DeploymentAction.loadServices({canaryId: this.canaryList[index - 1]}));
       this.store.dispatch(DeploymentAction.loadApplicationHelath({canaryId: this.canaryList[index - 1]}));
       this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: this.canaryList[index - 1], serviceId: this.selectedServiceId }));

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
  getOverallInfo() {
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
                  if (this.serviceConter === 1) {
                    this.store.dispatch(DeploymentAction.loadServiceInformation({ canaryId: resData.canaryRun, serviceId: this.selectedServiceId }));
                    this.serviceConter++;
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
                  this.selectedApplicationName = this.deploymentApplicationHealth.applicationName;
                  if(this.deploymentApplicationHealth.error != null){
                    this.notifications.showError('Application health Error:', this.deploymentApplicationHealth.error);
                  }
                  //buildApplicationForm() {
                    this.applicationForm = this.fb.group({
                      application: [this.selectedApplicationName],
                    });
                    this.applicationId = this.deploymentApplicationHealth.applicationId;
                 // }
                 
                 this.pieData = [
                  {
                    "name": "Failed" ,
                    "value": this.deploymentApplicationHealth.noOfFailed,
                    "label": "Failed"
                  },
                  {
                    "name": "Review",
                    "value": this.deploymentApplicationHealth.noOfReview,
                    "label": "Review"
                  },
                  {
                    "name": "Succeess",
                    "value": this.deploymentApplicationHealth.noOfSuccess,
                    "label": "Success"
                  },
                    {
                    "name": "InProgress",
                    "value": this.deploymentApplicationHealth.noOfInProgress,
                    "label": "InProgress"
                  }
                ];
             }
        }
      );
    }

    pieChartLabel(pieData: any[], name: string): string {
      const item = pieData.filter(data => data.name === name);
      if (item.length > 0) {
          return item[0].label;
      }
      return name;
  }

    // get service information
    getServiceInformation(){
      this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
        (resData) => {
          if(resData.serviceInformation !== null){
                  this.deployementLoading = resData.serviceInformationLoading;
                  this.deploymentServiceInformation = resData.serviceInformation;
                  if(this.deploymentServiceInformation.error != null){
                    this.notifications.showError('Service information Error:', this.deploymentServiceInformation.error);
                  }
             }
        }
      );
    }
}
