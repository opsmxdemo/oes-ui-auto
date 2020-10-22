import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormControl} from '@angular/forms';
import * as fromApp from '../store/app.reducer';
import {Observable} from 'rxjs';
import * as Visibility from './store/visibility.actions';
import {map, startWith} from 'rxjs/operators';

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

  //Services releated Initializations
  serviceList: any[];
  selectedServiceId: number;             // used for activating the service in left panel
  selectedService: any;
  // showApprovalHistory: boolean= false;
  constructor(public store: Store<fromApp.AppState>, private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllApplications();
    this.store.select('visibility').subscribe(
      (resData) => { 
        if (resData.applicationList != null) {
          this.applicationList = resData.applicationList;
          this.initFilterApplication();
        }
        if(resData.serviceList !=null && resData.serviceList != undefined ){
          this.serviceList = resData.serviceList;
          console.log("Here is the Service List: ", this.serviceList);
          this.selectedService = this.serviceList[0];
            this.selectedServiceId = this.serviceList[0].serviceId;
            console.log("Selected Service ID: ", this.selectedServiceId);
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
    console.log('Application List: ', this.applicationList); 

    
    this.applicationListOptions = this.applicationFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      console.log("Application List Options: ", this.applicationListOptions);   
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.applicationsObject.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSelectingApplication(selectedApplication){
    this.selectedApplication = selectedApplication;
    this.store.dispatch(Visibility.loadServices());
  }

  onClickService(service){
    this.selectedServiceId = service.serviceId;
    this.selectedService = service;
    console.log("selected Service: ", this.selectedService);
    

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
