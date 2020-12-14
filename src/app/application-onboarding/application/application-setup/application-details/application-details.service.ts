import { HttpClient } from '@angular/common/http';
import { ApplicationSetupComponent } from './../application-setup.component';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ApplicationListService } from '../../appliaction-list/application-list.service'
import { ApplicationRoadMapService } from '../application-road-map/application-road-map.service';
import { ApplicationSetupService } from '../application-setup.service';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { Observable } from 'rxjs/internal/Observable';
import * as $ from 'jquery';
// import {  } from '../application-road-map/application-road-map.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDetailsService extends ApplicationSetupService {

  $dataLoaded = new BehaviorSubject(false);
  
  applicationDetails: FormGroup;
  services: any = [];
  checkServiceFields: boolean =false;  // this is to check if all the service fields have serivces or not
  applicationNameParams: any;
  applicationDescriptionParams: any;
  applicationEmailParams: any;
  imageSourceParams: any;
  applicationDetailsUpdateParams: any;
  applicationDetailsCancelParams: any;
  applicationDetailsSaveParams: any;
  formControl: FormControl;
  formGroup: FormGroup;
  isParamsLoaded: boolean;
  editMode: boolean = this.appListService.editMode;       //used in enabling and diabling the features

  constructor(public http: HttpClient, public environment: AppConfigService, private appListService: ApplicationListService, public sharedService: SharedService, public toastr: NotificationService, public appRoadMapService: ApplicationRoadMapService,  public appSetupService: ApplicationSetupService) {
    super(http);
   }

   init(){

     if($('body').find('.tooltip-inner')){
      const removeElements = (elms) => elms.forEach(el => el.remove());
      removeElements( document.querySelectorAll(".tooltip.fade") );
    }

     this.applicationDetails = undefined;
     this.appRoadMapService.applicationDetails = this.applicationDetails;
      if(this.editMode){
        this.appListService.editApplicationAPI(this.appListService.applicationId).subscribe(resp => {
          this.appSetupService.showApplicationDetailsComp = true;
          this.appSetupService.showServiceDetailsComp = false;
          this.defineApplicationForm(resp);
          setTimeout(() => {
            this.initParametersForComponents();
            this.appRoadMapService.applicationDetails = this.applicationDetails;
          }, 100);
          console.log("Application Details: ", this.applicationDetails);
        });       

      }else{
          let appDetailObj = {
              "name": "",
              "description": "",
              "emailId": "",
              "imageSource": "",
            };
          this.defineApplicationForm(appDetailObj);
          setTimeout(() => {
          this.initParametersForComponents();
          }, 100);
      }
      this.applicationDetailsCancelParams = {
        text: "Cancel",
        type: 'button',
        hidden: false,
        id: 'applicationDetailsCancel-tagName'
      };
  }

  defineApplicationForm(resp){
    this.applicationDetails = new FormGroup({
      name : new FormControl(resp.name, [Validators.required, this.cannotContainSpace.bind(this),this.valitateApplicationName.bind(this)]),
      emailId :  this.editMode ?  new FormControl(resp.email, [Validators.required, Validators.email]) : new FormControl(resp.emailId, [Validators.required, Validators.email]), 
      description: new FormControl(resp.description),
      imageSource  : new FormControl(resp.imageSource),
      lastUpdatedTimestamp: resp.lastUpdatedTimestamp != undefined ? new FormControl(resp.lastUpdatedTimestamp) : new FormControl()
    });
    // if(this.editMode){
    //   this.applicationDetails.controls.emailId = new FormControl(resp.email, [Validators.required, Validators.email])

    // }else{
    //   this.applicationDetails.controls.emailId = new FormControl(resp.emailId, [Validators.required, Validators.email])
    // }
    this.services = resp.services != undefined ? resp.services : [];
    if(this.services.length > 0){
      this.checkServiceFields = this.services.every(item => item.name != '');
      this.appRoadMapService.checkServiceFields = this.checkServiceFields;
    }

    console.log("Check serivce Fields", this.checkServiceFields);
    

    this.appRoadMapService.services = this.services;
      console.log("Details Fn: ", resp);
      console.log("Services Fn: ", this.services);
      
  }


   initParametersForComponents(){
    this.applicationNameParams = {
      label: "Application Name",
      type: 'text',
      formControl: this.applicationDetails.get('name'),
      hidden: false,
      disabled: false,
      id: 'input-applicationName',
      required: true,
      placeholder: "Application Name",
      margin : "10px 0px"
    }; 
    if(this.editMode){
      this.applicationNameParams.disabled = true;
    }
    console.log("app Name: ", this.applicationNameParams);
    

    this.applicationDescriptionParams = {
      label: "Application Description",
      type: 'text',
      formControl:this.applicationDetails.get('description'),
      hidden: false,
      id: 'input-applicationDescription',
      required: false,
      placeholder: "Application Description",
      margin : "10px 0px"
    };   

    this.applicationEmailParams = {
      label: "Email Id",
      type: 'text',
      formControl:this.applicationDetails.get('emailId'),
      hidden: false,
      id: 'input-emailId',
      required: true,
      placeholder: "Email Id",
      margin : "10px 0px"
    };   

    this.imageSourceParams = {
      label: 'Image Source',
      disabled: false,
      formControl:this.applicationDetails.get('imageSource'),
      hidden: false,
      id: 'select-imageSource',
      required : false,
      options : [
        { value : "value1",name : "name1"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    //Show the buttons based on the Mode

    if(!this.editMode){
      this.applicationDetailsSaveParams = {
        text: "Save & Next",
        type: 'button',
        hidden: false,
        id: 'applicationDetailsSaveParams-tagName',
        color: 'blue'
      };
    }else{
      this.applicationDetailsUpdateParams = {
        text: "Update & Next",
        type: 'button',
        hidden: false,
        id: 'applicationDetailsUpdateParams-tagName',
        color: 'blue'
      };

    }

    this.isParamsLoaded = true;
  }

updateApplicationForm(application){
  console.log("updateApplicationForm()", application); 
  return this.http.put<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/application/' + this.appListService.applicationId, application.value).pipe(
    map(resdata => {
        this.appRoadMapService.applicationDetails = this.applicationDetails;
        this.toastr.showSuccess(resdata.name + ' updated Successfully','SUCCESS');
        // this.toastr.showSuccess('Updated application Successfully', 'SUCCESS');
        this.appSetupService.showApplicationDetailsComp = false;
        this.appSetupService.showServiceDetailsComp = true;
      //  return ApplicationAction.updateApplicationDone();
    }),
    catchError(errorRes => {
        this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR');
        return errorRes;
    })
  );   

}

  // Below function is use to submit applicatio form
  submitApplicationForm(application) {
      // return this.http.post<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/application', application);
      return this.http.post<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/application', application.value).pipe(
          map(resdata => {
            this.appRoadMapService.applicationDetails = this.applicationDetails;
            this.toastr.showSuccess('Application saved successfully','SUCCESS');
            this.appSetupService.showApplicationDetailsComp = false;
            this.appSetupService.showServiceDetailsComp = true;
            console.log("App setup service: ", this.appSetupService);

            // return ApplicationAction.savedApplication({ savedApplicationResponse: resdata, dataType: 'createApplication' });
          }),
          catchError(errorRes => {
              return errorRes;
          })
        );
  }


  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  valitateApplicationName(control: FormControl): Promise<any> | Observable<any> {
    if(control.value != null && control.value != undefined && control.value!="" && !this.editMode){
      let validateapp = this.cannotContainSpace(control)
      if(validateapp==null){
        const promise = new Promise<any>((resolve, reject) => {
          this.sharedService.validateApplicationName(control.value, 'name').subscribe(
            (response) => {
              if (response['nameExists'] === true) {
                this.applicationDetails.get('name').setErrors({ 'nameExists': true });
              } else {
                this.applicationDetails.get('name').setErrors(null);
              }
            },
            (error) => {
              resolve(null);
            }
          )
        });
        return promise;
      }
    }
   }

  //Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error
  cannotContainSpace(control: FormControl): { [s: string]: boolean } {
    if (control.value !== null) {
      let startingValue = control.value.split('');
      if (startingValue.length > 0 && (control.value as string).indexOf(' ') >= 0) {
        return { containSpace: true }
      }
      if (+startingValue[0] > -1 && startingValue.length > 0) {
        return { startingFromNumber: true }
      }
      if (!/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
        return { symbols: true };
      }
    }
    return null;
  }
    
  }
