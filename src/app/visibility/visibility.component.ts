import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormControl} from '@angular/forms';
import * as fromApp from '../store/app.reducer';
import {Observable} from 'rxjs';
import * as Visibility from './store/visibility.actions';
import {map, startWith} from 'rxjs/operators';
import * as $ from 'jquery'; 

export interface User {
  applicationName: string;
  id: any;
  applicationId: any;
}
@Component({
  selector: 'app-visibility',
  templateUrl: './visibility.component.html',
  styleUrls: ['./visibility.component.less']
})
export class VisibilityComponent implements OnInit {

  @Input() approvalGateComment : string;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // options: string[] = ['Pet Service Application', 'Only-metrics-app', 'logsApp'];
  // application related Initializations
  applicationList: any[]   //used to get the list from the API
  applicationsObject: any[]       // will be used to store the list of Applications and display in the select Application Dropdown
  applicationListOptions: Observable<any[]>;
  applicationFormControl = new FormControl();
  selectedApplication: string;
  // applicationForm: FormGroup;

  //Services related Initializations
  serviceList: any[];
  selectedServiceId: number;             // used for activating the service in left panel
  selectedService: any;
  serviceListLoading: boolean;

  //Tool Connector and Visibility related Initializations
  toolConnectors: any[];
  // connectorTypes: any[];
  visibilityData: any[];
  selectedTab: any;
  // approvalGateComments: string;
  approvalGateResponse: string;
  approvalWaitingStatus: boolean;         //When status is waiting its true else Approve / Reject its false

  // showApprovalHistory: boolean= false;
  constructor(public store: Store<fromApp.AppState>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getAllApplications();
    this.store.select('visibility').subscribe(
      (resData) => { 
        if (resData.applicationList != null) {
          this.applicationList = resData.applicationList;
          this.initFilterApplication();
        }
        console.log("service List Loading: ", this.serviceListLoading);
        
        if(resData.serviceList !=null && resData.serviceListLoading ){
          this.serviceList = resData.serviceList;
          this.serviceListLoading = resData.serviceListLoading
          // console.log("Here is the Service List: ", this.serviceList);
        }

        if(resData.toolConnectors != null && resData.toolConnectors != undefined){
          this.toolConnectors = resData.toolConnectors;
          this.selectedTab = this.toolConnectors[0]['connectorType'];
          setTimeout(()=>{
            $( '#'+ this.selectedTab).trigger('click');
            console.log("load this; ", this.selectedTab);
          },500);
          
        }
        if(resData.visibilityData != null){
          this.visibilityData = resData.visibilityData;
          // console.log("Visibility Data: ", this.visibilityData);
        } 
      });
  }

  // get application details
  getAllApplications() {
    this.store.dispatch(Visibility.loadApplications());
  }

  //Filtering the application in input field
  initFilterApplication() {
    this.applicationsObject = [];
    this.applicationList.forEach(val => {
      this.applicationsObject.push(val.name);
    });
    // console.log('Application List: ', this.applicationList); 

    
    this.applicationListOptions = this.applicationFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      // console.log("Application List Options: ", this.applicationListOptions);   
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.applicationsObject.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSelectingApplication(selectedApplication){
    this.selectedApplication = selectedApplication;
    this.store.dispatch(Visibility.loadServices());

    setTimeout(()=>{
      this.selectedService = this.serviceList[0];
      this.selectedServiceId = this.serviceList[0].serviceId;
      this.approvalWaitingStatus= this.selectedService.status == 'Waiting' ? true : false;
    },500);
          
    this.store.dispatch(Visibility.loadToolConnectors());
    this.store.dispatch(Visibility.loadVisibilityData());

  }

  onClickService(service){
    this.selectedService = service;
    this.selectedServiceId = service.serviceId;
    this.approvalWaitingStatus= this.selectedService.status == 'Waiting' ? true : false;
    console.log("selected Service: ", this.selectedService);
    this.store.dispatch(Visibility.loadToolConnectors());
    this.store.dispatch(Visibility.loadVisibilityData());
    console.log("Selected Service ID: ", this.selectedServiceId);

  }
  onSelectingTab(selectedTab){
    this.selectedTab = selectedTab;
    console.log("selected Tab: ", this.selectedTab);
    
  }
  approvalGateReview(response, comments){
    //Below we will be sending the Action either Approve or Reject to backend
    ///approvalGateInstances/{id}/review
    this.approvalGateResponse = response;
    // Comments need to be posted to backend
    this.approvalGateComment = comments.viewModel;
    console.log("Comments:", this.approvalGateComment);
    
    this.approvalWaitingStatus = false;

  }

  // code below to show the approval history
  getApprovalHistory(){
    // this.showApprovalHistory = true;
  }

  // code below to initiate the approval
  initiateApproval(){
    // this.showApprovalHistory = false;
  }
}
