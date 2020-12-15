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
    super(http, environment, sharedService);
   }

   init(){

     if($('body').find('.tooltip-inner')){
      const removeElements = (elms) => elms.forEach(el => el.remove());
      removeElements( document.querySelectorAll(".tooltip.fade") );
    }

    //  ApplicationSetupService.applicationDetails = undefined;
    setTimeout(() => {
            this.initParametersForComponents();
            // this.appRoadMapService.applicationDetails = this.applicationDetails;
          }, 1000);

    //  this.appRoadMapService.applicationDetails = this.applicationDetails;
      
      this.applicationDetailsCancelParams = {
        text: "Cancel",
        type: 'button',
        hidden: false,
        id: 'applicationDetailsCancel-tagName'
      };
  }

  editApplicationAPI(appId){
               return this.http.get<any>(this.environment.config.endPointUrl + 'platformservice/v1/applications/' + appId);

  }



   initParametersForComponents(){
     console.log("Init params: ", ApplicationSetupService.applicationDetails);
     
    this.applicationNameParams = {
      label: "Application Name",
      type: 'text',
      formControl: ApplicationSetupService.applicationDetails.get('name'),
      hidden: false,
      disabled: false,
      id: 'input-applicationName',
      required: true,
      placeholder: "Application Name",
      margin : "10px 0px"
    }; 
    if(ApplicationSetupService.editMode){
      this.applicationNameParams.disabled = true;
    }
    console.log("app Name: ", this.applicationNameParams);
    

    this.applicationDescriptionParams = {
      label: "Application Description",
      type: 'text',
      formControl:ApplicationSetupService.applicationDetails.get('description'),
      hidden: false,
      id: 'input-applicationDescription',
      required: false,
      placeholder: "Application Description",
      margin : "10px 0px"
    };   

    this.applicationEmailParams = {
      label: "Email Id",
      type: 'text',
      formControl:ApplicationSetupService.applicationDetails.get('emailId'),
      hidden: false,
      id: 'input-emailId',
      required: true,
      placeholder: "Email Id",
      margin : "10px 0px"
    };   

    this.imageSourceParams = {
      label: 'Image Source',
      disabled: false,
      formControl:ApplicationSetupService.applicationDetails.get('imageSource'),
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

    if(!ApplicationSetupService.editMode){
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
        // this.appRoadMapService.applicationDetails = this.applicationDetails;
        this.toastr.showSuccess(resdata.name + ' updated Successfully','SUCCESS');
        // this.toastr.showSuccess('Updated application Successfully', 'SUCCESS');
        ApplicationSetupService.showApplicationDetailsComp = false;
        ApplicationSetupService.showServiceDetailsComp = true; 
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
          map(resp => {
            // this.appRoadMapService.applicationDetails = this.applicationDetails;
            this.toastr.showSuccess('Application saved successfully','SUCCESS');
            ApplicationSetupService.showApplicationDetailsComp = false;
            ApplicationSetupService.showServiceDetailsComp = true;

            ApplicationSetupService.applicationDetails =  new FormGroup({
            name : new FormControl(resp.name, [Validators.required, this.cannotContainSpace.bind(this),this.valitateApplicationName.bind(this)]),
            emailId :  ApplicationSetupService.editMode ?  new FormControl(resp.email, [Validators.required, Validators.email]) : new FormControl(resp.emailId, [Validators.required, Validators.email]), 
            description: new FormControl(resp.description),
            imageSource  : new FormControl(resp.imageSource),
            lastUpdatedTimestamp: resp.lastUpdatedTimestamp != undefined ? new FormControl(resp.lastUpdatedTimestamp) : new FormControl(),
            services: resp.services.length > 0 ? resp.services : []
          });
            console.log("App setup service: ", this.appSetupService);

            // return ApplicationAction.savedApplication({ savedApplicationResponse: resdata, dataType: 'createApplication' });
          }),
          catchError(errorRes => {
              return errorRes;
          })
        );
  }


    
  }
