import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as fromApp from '../../store/app.reducer';
import * as DeploymentAction from './store/deploymentverification.actions';
import * as AppOnboardingAction from '../../application-onboarding/store/onBoarding.actions';
import * as LayoutAction from '../../layout/store/layout.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';

@Component({
  selector: 'app-deployment-verification',
  templateUrl: './deployment-verification.component.html',
  styleUrls: ['./deployment-verification.component.less']
})
export class DeploymentVerificationComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
  public deployementRun: any;
  showCommonInfo: string;

  // myControl = new FormControl();
  // options: string[] = ['11883', '11884', '11885'];
  // filteredOptions: Observable<string[]>;
  control = new FormControl('11885');
  canaries: string[] = ['11883', '11884', '11885', '11886', '11887','12345','12222','13452'];
  filteredCanaries: Observable<string[]>;
  inputVar: string;
  canaryList: string[];
  incredementDisable = false;
  decrementDisable = false;
  deployementLoading: boolean = true;
  ///canaryList: [];

   constructor(public sharedService: SharedService, public store: Store<fromApp.AppState>,
    public autopilotService: AutopiloService, public notifications: NotificationService) { }

  ngOnInit(): void {

    this.store.select('deploymentOnboarding').subscribe(
      (resData) => {
        if(resData.canaryRun !== null){
                this.deployementLoading = resData.deployementLoading;
                this.deployementRun = resData.canaryRun;
                console.log(resData);
           }
      }
    );

    this.filteredCanaries = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.showCommonInfo = 'show';
    this.inputVar = '11885';
    
  }
  
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.canaries.filter(canaryId => this._normalizeValue(canaryId).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  // get canary run
  //fetching latest run from deployment state
    // this.store.select('deploymentOnboarding').subscribe(
    //   (resdata) => {
    //     if(resdata.canaryRun !== null){
    //       this.deployementLoading = resdata.deployementLoading;
    //       this.deployementRun = resdata.canaryRun;
          
    //   }
    // ),
    //this.store

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
}
