import { HttpClient } from '@angular/common/http';
import { ApplicationSetupComponent } from './../application-setup.component';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ApplicationListService } from '../../appliaction-list/application-list.service'
import { BehaviorSubject } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDetailsService {

  $dataLoaded = new BehaviorSubject(false);
  
  applicationDetails: any;
  editApplicationDetails: any;
  applicationNameParams: any;
  applicationDescriptionParams: any;
  applicationEmailParams: any;
  imageSourceParams: any;
  applicationDetailsUpdateParams: any;
  formControl: FormControl;
  formGroup: FormGroup;

  constructor(public http: HttpClient, public environment: AppConfigService, private appListService: ApplicationListService, public sharedService: SharedService,) {
   }

   init(){
     this.applicationDetails = undefined;
      if(this.appListService.editMode){
        this.appListService.editApplicationAPI(this.appListService.applicationId).subscribe(resp => {
          this.defineApplicationForm(resp);
          console.log(this.editApplicationDetails);
          setTimeout(() => {
            this.initParametersForComponents();
          }, 100);
          console.log("Application Details: ", this.applicationDetails);
        });       

      }else{
          let appDetailObj = {
              "name": "",
              "description": "",
              "email": "",
              "imageSource": "",
            };
          this.defineApplicationForm(appDetailObj);
          this.initParametersForComponents()
      }
      this.applicationDetailsUpdateParams = {
        text: "Save & Next",
        type: 'button',
        hidden: false,
        id: 'applicationDetailsUpdateParams-tagName',
        color: 'blue'
      };
  }

  defineApplicationForm(resp){
    this.applicationDetails = new FormGroup({
      name : new FormControl(resp.name, [Validators.required, this.cannotContainSpace.bind(this),this.valitateApplicationName.bind(this)]),
      description: new FormControl(resp.description),
      email : new FormControl(resp.email, [Validators.required, Validators.email]),
      imageSource  : new FormControl(resp.imageSource),
    });
      console.log("Application Details Fn: ", this.applicationDetails);
      
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
    if(this.appListService.editMode){
      this.applicationNameParams.disabled = true;
    }
    console.log("app Name: ", this.applicationNameParams);
    

    this.applicationDescriptionParams = {
      label: "Application Description",
      type: 'text',
      formControl:this.applicationDetails.get('description'),
      hidden: false,
      id: 'input-applicationDescription',
      required: true,
      placeholder: "Application Description",
      margin : "10px 0px"
    };   

    this.applicationEmailParams = {
      label: "Email Id",
      type: 'text',
      formControl:this.applicationDetails.get('email'),
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

  }


  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  valitateApplicationName(control: FormControl): Promise<any> | Observable<any> {
    if(control.value != null && control.value != undefined && control.value!="" && !this.appListService.editMode){
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
