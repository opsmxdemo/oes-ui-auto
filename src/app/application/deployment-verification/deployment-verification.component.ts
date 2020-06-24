import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as fromApp from '../../store/app.reducer';
import * as deploymentApp from './store/deploymentverification.reducer';
import * as DeploymentAction from './store/deploymentverification.actions';
import * as AppOnboardingAction from '../../application-onboarding/store/onBoarding.actions';
import * as LayoutAction from '../../layout/store/layout.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { NumberLiteralType } from 'typescript';
// import * as PlotlyJS from 'plotly.js/dist/plotly';
// import { PlotlyModule } from 'angular-plotly.js';

// PlotlyModule.plotlyjs = PlotlyJS;


export interface User {
  name: string;
  id: any;
}

@Component({
  selector: 'app-deployment-verification',
  templateUrl: './deployment-verification.component.html',
  styleUrls: ['./deployment-verification.component.less']
})
export class DeploymentVerificationComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
  deployementRun: any;
  showCommonInfo: string;
  control = new FormControl(this.deployementRun);
  canaries: string[] = ['11883', '11884', '11885', '11886', '11887','12345','12222','13452'];
  filteredCanaries: Observable<string[]>;
  inputVar: string;
  canaryList: string[];
  incredementDisable = false;
  decrementDisable = false;
  deployementLoading: boolean = true;
  showFiller = false;
  nav_position: string = 'end';
  counter = 1;
  serviceCounter = 0;
  

  
  ///code for showing select application shows here
  myControl = new FormControl('Pet Service Application');
  options: User[] = [];
  filteredOptions: Observable<User[]>;
  isShow = true;
  deployementApplications: any;
  deploymentServices: any;
  deploymentApplicationHealth: any;
  newServ: any;
  selectedServiceId: number;
  deploymentServiceInformation: any;

   constructor(public sharedService: SharedService, public store: Store<fromApp.AppState>,
    public autopilotService: AutopiloService, public notifications: NotificationService) { }

  ngOnInit(): void {


    this.getLatestRun();
    this.getAllApplications();
    this.getAllServices();
    this.getApplicationHealth();
    this.getServiceInformation();

  
  
    //code for showing application list
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
    //code for showing application list ending here

    this.filteredCanaries = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCanaries(value))
    );
    this.showCommonInfo = 'show';
    this.inputVar = '11885';
    
  }
  
  
  private _filterCanaries(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.canaries.filter(canaryId => this._normalizeValue(canaryId).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

    // set default canary id
    setValue() {
      // let filteredCanaries = this._auto.autocomplete.canaries.toArray()
      // this.control.setValue(filteredCanaries[1].value)'
    }
    incrementInputVar(max:any) {
     //this.decrementDisable = ;
     this.canaries.sort();
     this.canaryList = this.canaries;
  //   this.canaryList.sort();
     var length = this.canaryList.length;
     var index = this.canaryList.findIndex(cid => cid == max);
     if(index +1 === length -1){
       this.decrementDisable = false;
      this.incredementDisable = true;
     }else{
      this.decrementDisable = false;
      this.incredementDisable = false;
     }
  
        if(index !== -1){
          if(index+1 === length-1){
            this.incredementDisable = true;
            this.inputVar = this.canaryList[index];
          }else{
            this.inputVar = this.canaryList[index+1];
          }
        }
    }
    decrementInputVar(min:any) {
      this.incredementDisable = false;
      this.canaries.sort();
      this.canaryList = this.canaries;
      var length = this.canaryList.length;
      var index = this.canaryList.findIndex(cid => cid == min);
        if(index  === 0){
          this.decrementDisable = true;
          this.incredementDisable = false;
        }else{
          this.decrementDisable = false;
          this.incredementDisable = false;
        }
      
         if(index !== -1 && index !== 0){
           this.inputVar = this.canaryList[index-1];
         }else if(index === 0){
           this.inputVar = this.canaryList[index];
         }
       }

    //code for application list display starts here
    displayFn(user: User): string {
      return user && user.name ? user.name : '';
    }
  
    private _filter(name: string): User[] {
      const filterValue = name.toLowerCase();
  
      return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
    
    onTogglePosition(position: string) {
      this.nav_position = position === 'start' ? 'end' : 'start';
      
    }
    getOverallInfo(){
      this.isShow = !this.isShow;
    }

    // get latest canary run
    getLatestRun(){
      this.store.dispatch(DeploymentAction.loadLatestRun());
      this.store.select('deploymentOnboarding').subscribe(
      (resData) => {
        if(resData.canaryRun !== null){
                this.deployementLoading = resData.deployementLoading;
                this.deployementRun = resData.canaryRun;  
               if(this.counter === 1){
                this.store.dispatch(DeploymentAction.loadServices({canaryId: this.deployementRun}));
                this.store.dispatch(DeploymentAction.loadApplicationHelath({canaryId: this.deployementRun}));
                  this.counter ++;
               }
           }
      }
    );
    }

  // get application details
    getAllApplications(){
      this.store.dispatch(DeploymentAction.loadApplications());
      this.store.select('deploymentOnboarding').subscribe(
        (resData) => {
          if(resData.applicationList !== null){
                  this.deployementLoading = resData.applicationListLoading;
                  this.deployementApplications = resData.applicationList;
                  this.options = resData.applicationList;
                  console.log(resData);
                  //alert(this.deployementRun);
             }
        }
      );
    }

    // get application details
    getAllServices(){
      this.store.select('deploymentOnboarding').subscribe(
        (resData) => {
          if(resData.serviceList !== null){
                  this.deployementLoading = resData.serviceListLoading;
                  this.deploymentServices = resData.serviceList;
                  this.newServ = this.deploymentServices.services;
                  this.selectedServiceId = this.deploymentServices.services[0].serviceId;
                  if(this.serviceCounter === 0){
                    this.store.dispatch(DeploymentAction.loadServiceInformation({canaryId: 87,serviceId: this.selectedServiceId}));
                    this.serviceCounter ++;
                  }
               //   this.options = resData.serviceList;
                  console.log(resData);
                  //alert(this.deployementRun);
             }
        }
      );
    }

    // get application health details
    getApplicationHealth(){
      this.store.select('deploymentOnboarding').subscribe(
        (resData) => {
          if(resData.applicationHealthDetails !== null){
                  this.deployementLoading = resData.applicationHealthDetailsLoading;
                  this.deploymentApplicationHealth = resData.applicationHealthDetails;
                  if(this.deploymentApplicationHealth.error != null){
                    this.notifications.showError('Application health Error:', this.deploymentApplicationHealth.error);
                  }
             }
        }
      );
    }

    // get service information
    getServiceInformation(){
      this.store.select('deploymentOnboarding').subscribe(
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
