import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ApplicationSetupService } from '../application-setup.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
// import { ApplicationDetailsService } from "../application-details/application-details.service";

@Injectable({
  providedIn: 'root'
})
export class ApplicationRoadMapService {

  applicationDetails: FormGroup = null; // Data will be form the Application Details
  services: any;
  checkServiceFields: boolean;
  servicesForm: any;
  environmentForm: any;
  groupPermissionForm: any;
  editMode: any;
  applicationName: any;

  constructor(public http: HttpClient, public environment: AppConfigService, public appSetupService: ApplicationSetupService) {
  }

  initChanges(){

// if(this.appDetailService.applicationNameParams != undefined && this.appDetailService.applicationNameParams.formControl != undefined){
//   console.log(this.appDetailService);
  
//     if(this.appDetailService.applicationNameParams.formControl.status == 'VALID' && this.appDetailService.applicationEmailParams.formControl.status == 'VALID'){
//       this.applicationName = 'VALID';
//     }else{
//       this.applicationName = 'INVALID';
//     }
// }
//     console.log("App Details: ", this.appDetailService.applicationNameParams);



if(this.applicationDetails != undefined  ){
  console.log("RoadMap App Details: ", this.applicationDetails);
  
    if(this.applicationDetails.status == 'VALID' ){
      this.applicationName = 'VALID';
    }else{
      this.applicationName = 'INVALID';
    }
}

  }

    init(){
      this.checkServiceFields = false;

    }

    showApplicationDetails(){
      this.appSetupService.showApplicationDetailsComp = true;
      this.appSetupService.showServiceDetailsComp = false;
    }


  loadApplicationForm(){

  }

  loadServiceForm(){

  }
  editServiceClick(serviceArr, i){

  }
  loadEnvironmentsForm(){

  }
  loadGroupPermissionForm(){

  }
}
