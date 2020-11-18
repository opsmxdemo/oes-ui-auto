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
import { NotificationService } from 'src/app/services/notification.service';

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
  selectedService: any;                         // This will store the value of the selected service
  serviceListLoading: boolean;

  //Tool Connector and Visibility related Initializations
  toolConnectors: any[];
  approvalGateId: number;
  approvalGateInstanceId: number;
  // connectorTypes: any[];
  connectorType: any;
  showToolConnectorSection: boolean = false;
  // approvalGateComments: string;
  approvalGateResponse: string;
  approvalWaitingStatus: boolean = true;         //When status is waiting its true else Approve / Reject its false
  gateStatus: string = '';                                          // Store the action / status of the Approval Gate
  firstTimeLoad: boolean = true;                        // check tos see if the application is called only once
  selectedApplicationId: any;
  serviceListEmpty: boolean;
  visibilityData: any[];
  // gitVisibilityData: any = [];
  // jiraVisibilityData: any = [];
  selectedConnectorType: string;

  //If the Visibility is redirected from other page load the application based on params
  paramsApplicationName: string;
  paramsApplicationId: any;

  //Gate instance  variables after Approval
  gateInstanceDetails: any;
  gateActivatedTime: any;
  gateApprovalTime: any;
  gateApprovalCallBackURL: any;                       // callback URL from Instance Details
  gateRejectionCallBackURL: any;                       // rejection URL from Instance Details
  gateStatusPending: boolean;

  // showApprovalHistory: boolean= false;
  constructor(public store: Store<fromApp.AppState>, private fb: FormBuilder, private route: ActivatedRoute, public toastr: NotificationService,) { }

  ngOnInit(): void {
    $("[data-toggle='tooltip']").tooltip('hide');
    //assign the parameter is available
    this.paramsApplicationName = this.route.snapshot.params.applicationName;
    this.paramsApplicationId = this.route.snapshot.params.applicationId;

    this.getAllApplications();
    this.store.select('visibility').subscribe(
      (resData) => {         
        if (resData.applicationList != null && resData.applicationListLoading) {
          this.applicationList = resData.applicationList;
          this.store.dispatch(Visibility.stopLoadingApplication());   
          this.initFilterApplication();
          // to set initial Application 
          if(this.firstTimeLoad){
              this.onSelectingApplication(this.applicationList[0].applicationName);
            this.firstTimeLoad = false;
          }
        }
        
        if(resData.serviceList !=null && resData.serviceListLoading ){
          this.serviceList = resData.serviceList;
          this.serviceListLoading = resData.serviceListLoading

          if(this.serviceList.length > 0){
          this.onClickService(this.serviceList[0]);
          this.serviceListEmpty = false; 
          }else{
            this.serviceListEmpty = true;
          }

          this.store.dispatch(Visibility.stopLoadingService());          
        }

        if(resData.toolConnectors != null && resData.toolConnectors != undefined && resData.connectorTypeLoading){
          this.toolConnectors = resData.toolConnectors;            
          this.store.dispatch(Visibility.stopLoadingConnectors());   
          
            if(this.toolConnectors.length > 0){
            this.selectedConnectorType = this.toolConnectors[0]['connectorType'];
            this.onSelectingToolConnector(this.selectedConnectorType); 
            this.showToolConnectorSection = true;
            }else{
              this.showToolConnectorSection = false;
            }
        }

        if(resData.gateInstanceDetails != null && resData.gateInstanceDetails != undefined && resData.gateInstanceDetailsLoading){
          this.gateInstanceDetails = resData.gateInstanceDetails;  
          this.gateActivatedTime = new Date(this.gateInstanceDetails.activatedTime);          
          this.gateApprovalTime = this.gateInstanceDetails.lastUpdatedTime;
          this.gateApprovalCallBackURL = this.gateInstanceDetails.approvalCallbackURL;
          this.gateRejectionCallBackURL = this.gateInstanceDetails.rejectionCallbackURL;
          this.approvalGateComment = this.gateInstanceDetails.approvalStatus.comment;
          // this.gateStatus = this.gateInstanceDetails.approvalStatus.status;
          
          // this.store.dispatch(Visibility.stopLoadingConnectors());   
          
        }
        if(resData.visibilityData != null && resData.visibilityDataLoaded){
            this.visibilityData = [];
            this.store.dispatch(Visibility.visibilityDataLoading());
          if(this.selectedConnectorType === "GIT"){
          this.visibilityData = resData.visibilityData;
          console.log("GIT: ", this.visibilityData);
          
          }else if (this.selectedConnectorType === "JIRA"){
          this.visibilityData = resData.visibilityData;
          console.log("JIRA: ", this.visibilityData);
          
          }else if (this.selectedConnectorType === "AUTOPILOT"){
          this.visibilityData = resData.visibilityData;
          console.log("AUTOPILOT: ", this.visibilityData);
          
          }else if (this.selectedConnectorType === "SONARQUBE"){
          this.visibilityData = resData.visibilityData;
          console.log("SONARQUBE: ", this.visibilityData);
          
          }else if (this.selectedConnectorType === "JENKINS"){
          this.visibilityData = resData.visibilityData;
          console.log("JENKINS: ", this.visibilityData);
          
          }
        } 
      });
  }

  // get application details
  getAllApplications() {

    setTimeout(()=>{      
      this.store.dispatch(Visibility.loadApplications());
    }, 2500);
  }

  //Filtering the application in input field
  initFilterApplication() {
    this.applicationsObject = [];
    this.applicationList.forEach(val => {
      this.applicationsObject.push(val.applicationName);
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

    if((this.paramsApplicationId != null || this.paramsApplicationId != undefined) && this.firstTimeLoad){
      this.selectedApplication = this.paramsApplicationName;
      this.applicationFormControl.setValue(this.paramsApplicationName);
      this.store.dispatch(Visibility.loadServices({applicationId: this.paramsApplicationId}));
    }else{
      this.selectedApplication = selectedApplication;
      this.selectedApplicationId = this.applicationList.find(item => {
        if(item.applicationName == this.selectedApplication){
          return item.applicationId;
        }
      }).applicationId;
      this.applicationFormControl.setValue(this.selectedApplication); 
      this.store.dispatch(Visibility.loadServices({applicationId: this.selectedApplicationId}));
    }

  }

  onClickService(service){
    this.selectedService = service;
    this.gateStatus = service.status.status;  
    this.selectedServiceId = service.serviceId;
    this.approvalGateId = this.selectedService.approvalGateId;
    this.approvalGateInstanceId = this.selectedService.approvalGateInstanceId;
    this.approvalWaitingStatus= this.selectedService.status.status == 'activated' ? true : false;
    this.approvalGateComment = (this.selectedService.status.comment !== undefined || this.selectedService.status.comment !== '') ? this.selectedService.status.comment : '';
    if(this.approvalGateInstanceId === null){
      this.servicePending(this.selectedService);
    }else{
      this.gateStatusPending = false;
      this.store.dispatch(Visibility.loadToolConnectors({ id: this.approvalGateId }));
      this.store.dispatch(Visibility.loadGateInstanceDetails({ id: this.approvalGateInstanceId }));    
    }

  }
  servicePending(service){
    this.selectedService = service;
    this.gateStatus = service.status.status;
    this.selectedServiceId = service.serviceId;
    this.approvalWaitingStatus= this.selectedService.status.status == 'activated' ? true : false;
    // this.approvalWaitingStatus= false;
    this.approvalGateComment = 'This gate is not activated';
    this.gateStatusPending = true;
      this.toastr.showInfo('This approval gate is not activated.','Status');
  }

  onSelectingToolConnector(connectorType){    
    this.selectedConnectorType = connectorType;    
    this.store.dispatch(Visibility.loadVisibilityData({approvalInstanceId: this.approvalGateInstanceId, connectorType: this.selectedConnectorType}));

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
