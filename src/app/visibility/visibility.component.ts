import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormControl} from '@angular/forms';
import * as fromApp from '../store/app.reducer';
import {Observable} from 'rxjs';
import * as Visibility from './store/visibility.actions';
import {map, startWith} from 'rxjs/operators';
import * as $ from 'jquery'; 
import { ActivatedRoute } from '@angular/router';

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
  control = new FormControl();
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
  approvalGateId: number;
  approvalGateInstanceId: number;
  // connectorTypes: any[];
  connectorType: any;
  // approvalGateComments: string;
  approvalGateResponse: string;
  approvalWaitingStatus: boolean = true;         //When status is waiting its true else Approve / Reject its false
  firstTimeLoad: boolean = true;
  selectedApplicationId: any;
  serviceListEmpty: boolean;
  gitVisibilityData: any;
  jiraVisibilityData: any;
  selectedConnectorType: string;

  // showApprovalHistory: boolean= false;
  constructor(public store: Store<fromApp.AppState>, private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.route);
    this.getAllApplications();
    this.store.select('visibility').subscribe(
      (resData) => {         
        if (resData.applicationList != null && resData.applicationListLoading) {
          this.applicationList = resData.applicationList;
          this.store.dispatch(Visibility.stopLoadingApplication());   
          this.initFilterApplication();
          // to set initial Application 
          if(this.firstTimeLoad){
            this.applicationFormControl.setValue(this.applicationList[0].name);
            this.onSelectingApplication(this.applicationList[0].name);
            this.firstTimeLoad = false;
          }
        }
        
        if(resData.serviceList !=null && resData.serviceListLoading ){
          this.serviceList = resData.serviceList;
          this.serviceListLoading = resData.serviceListLoading

          if(this.serviceList.length > 0){
          this.selectedService = this.serviceList[0];
          this.onClickService(this.serviceList[0]);
          this.selectedServiceId = this.serviceList[0].serviceId;
          this.approvalGateId = this.selectedService.approvalGateId;
          this.approvalGateInstanceId = this.selectedService.approvalGateInstanceId;
          this.approvalWaitingStatus= this.selectedService.status.status == 'activated' ? true : false;
          this.approvalGateComment = (this.selectedService.status.comment !== undefined || this.selectedService.status.comment !== '') ? this.selectedService.status.comment : '';
          this.serviceListEmpty = false; 
          }else{
            this.serviceListEmpty = true;
          }

          this.store.dispatch(Visibility.stopLoadingService());          
        }

        if(resData.toolConnectors != null && resData.toolConnectors != undefined && resData.connectorTypeLoading){
          this.toolConnectors = resData.toolConnectors;  
          console.log("Tool Connectors: ", this.toolConnectors);
          
          this.store.dispatch(Visibility.stopLoadingConnectors());   
          
            if(this.toolConnectors.length > 0){
            this.connectorType = this.toolConnectors[0]['connectorType'];
            this.onSelectingToolConnector(this.connectorType); 
            }
        }
        if(resData.visibilityData != null && resData.visibilityDataLoaded){
          if(this.connectorType === "GIT"){
          this.gitVisibilityData = resData.visibilityData;

          }else if (this.connectorType === "JIRA"){
          this.jiraVisibilityData = resData.visibilityData;

          }
        } 
      });
  }

  // get application details
  getAllApplications() {

    setTimeout(()=>{      
      this.store.dispatch(Visibility.loadApplications());
    }, 1500);
  }

  //Filtering the application in input field
  initFilterApplication() {
    this.applicationsObject = [];
    this.applicationList.forEach(val => {
      this.applicationsObject.push(val.name);
    });

    this.applicationListOptions = this.applicationFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.applicationsObject.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSelectingApplication(selectedApplication){
    this.selectedApplication = selectedApplication;
    this.selectedApplicationId = this.applicationList.find(item => {
      if(item.name == this.selectedApplication){
        return item.applicationId;
      }
    })
    this.store.dispatch(Visibility.loadServices(this.selectedApplicationId));

  }

  onClickService(service){
    this.selectedService = service;
    this.selectedServiceId = service.serviceId;
    this.approvalGateId = this.selectedService.approvalGateId;
    this.approvalGateInstanceId = this.selectedService.approvalGateInstanceId
    this.approvalWaitingStatus= this.selectedService.status.status == 'activated' ? true : false;
    this.approvalGateComment = this.selectedService.status.comment;
    console.log("Load Comment: ", this.selectedService.status.comment);
    
    this.store.dispatch(Visibility.loadToolConnectors({ id: this.approvalGateId }));
  }
  onSelectingToolConnector(connectorType){    
    this.selectedConnectorType = connectorType;
    if(connectorType === 'GIT'){
      this.jiraVisibilityData = "";

    }else if (connectorType === 'JIRA'){
      this.gitVisibilityData = "";

    }
    this.store.dispatch(Visibility.loadVisibilityData({approvalInstanceId: this.approvalGateInstanceId, connectorType: connectorType}));

  }
  approvalGateReview(response, comments){
    //Below we will be sending the Action either Approve or Reject to backend
    this.approvalGateResponse = response;
    // Comments need to be posted to backend
    this.approvalGateComment = comments.viewModel;    
    this.approvalWaitingStatus = false;
    
    let postData = {
      'action': this.approvalGateResponse,
      'comment': this.approvalGateComment
    }

    this.store.dispatch(Visibility.postReview({ approvalInstanceId: this.approvalGateInstanceId, applicationId: this.selectedApplicationId,  postData: postData }));    

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
