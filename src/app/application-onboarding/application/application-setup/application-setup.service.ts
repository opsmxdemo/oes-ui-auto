import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { SharedService } from 'src/app/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationSetupService {

  public static id: number = 0;
  public static applicationDetails: any = {};
  public static showApplicationDetailsComp: boolean = true;
  public static showServiceDetailsComp: boolean;
  public static editMode: boolean;
  public static isAppParamsLoaded: boolean = false;
  applicationNameParams: any;
  applicationDescriptionParams: any;
  applicationEmailParams: any;
  imageSourceParams: any;
  services: any;                              // Each service
  checkServiceFields: any;        // See if all the service fields are entered

  constructor(public http: HttpClient, public environment: AppConfigService, public sharedService: SharedService) { }

  init() {
    this.getAppDetails();
  }

  getAppDetails() {
    // call get app details api function this.getApplications() if id > 0
    // else assign an empty object same as the get api response
    // assign it to applicationDetails variable
      if(ApplicationSetupService.id > 0){
        
        ApplicationSetupService.editMode = true;
        this.getApplication(ApplicationSetupService.id).subscribe(resp => {
          ApplicationSetupService.showApplicationDetailsComp = true;
          ApplicationSetupService.showServiceDetailsComp = false;
          this.defineApplicationForm(resp);
          console.log("Application Details: ", ApplicationSetupService.applicationDetails);
        });       

      }else{
        ApplicationSetupService.editMode = false;
        
          let appDetailObj = {
              "name": "",
              "description": "",
              "emailId": "",
              "imageSource": "",
            };
          this.defineApplicationForm(appDetailObj);
      }
  }


  defineApplicationForm(resp){
    ApplicationSetupService.applicationDetails = new FormGroup({
      name : new FormControl(resp.name, [Validators.required, this.cannotContainSpace.bind(this),this.valitateApplicationName.bind(this)]),
      emailId :  ApplicationSetupService.editMode ?  new FormControl(resp.email, [Validators.required, Validators.email]) : new FormControl(resp.emailId, [Validators.required, Validators.email]), 
      description: new FormControl(resp.description),
      imageSource  : new FormControl(resp.imageSource),
      lastUpdatedTimestamp: resp.lastUpdatedTimestamp != undefined ? new FormControl(resp.lastUpdatedTimestamp) : new FormControl()
    });
    console.log("Form Define: ", ApplicationSetupService.applicationDetails);
    
    this.services = resp.services != undefined ? resp.services : [];

    if(this.services.length > 0){
      this.checkServiceFields = this.services.every(item => item.name != '');
    }

    console.log("Check serivce Fields", this.checkServiceFields);
      console.log("Details Fn: ", resp);
      console.log("Services Fn: ", this.services);
      
  }

  getApplication(appId){
               return this.http.get<any>(this.environment.config.endPointUrl + 'platformservice/v1/applications/' + appId);

  }
  // getApplications(appId) {
  //   // call api with the this.id
  //   console.log("Setup Applications: ", appId);
    
  //          return this.http.get<any>(this.environment.config.endPointUrl + 'platformservice/v1/applications/' + appId);

  // }

  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  valitateApplicationName(control: FormControl): Promise<any> | Observable<any> {
    if(control.value != null && control.value != undefined && control.value!="" && !ApplicationSetupService.editMode){
      let validateapp = this.cannotContainSpace(control);
      console.log("Name: ", control.value);
      
      if(validateapp==null){
        const promise = new Promise<any>((resolve, reject) => {
                console.log('Set Erros: ', ApplicationSetupService.applicationDetails);

          this.sharedService.validateApplicationName(control.value, 'name').subscribe(
            (response) => {
              if (response['nameExists'] === true) {
                ApplicationSetupService.applicationDetails.get('name').setErrors({ 'nameExists': true });
              } else {
                ApplicationSetupService.applicationDetails.get('name').setErrors(null);
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
