import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ApplicationDetailsService } from './application-details.service';
// import { ApplicationRoadMapService } from "../application-road-map/application-road-map.service";
// import { ApplicationServiceService } from '../application-service/application-service.service';
import { ApplicationSetupService } from '../../application-setup/application-setup.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.less'],
  providers :[ApplicationDetailsService, ApplicationSetupService]
})
export class ApplicationDetailsComponent implements OnInit {

  constructor(public appDetailService: ApplicationDetailsService, public toastr: NotificationService, public router: Router ) { }
  // ngOnChanges(){

  //   this.appDetailService.init();
  //   // if(this.appDetailService.applicationDetails != null){
  //   // this.appDetailService.init();
  //   // }
  //   // if(this.appDetailService.applicationDetails != null){

  //   // }
  // }

  ngOnInit(): void {

    this.appDetailService.init();
    this.appDetailService.$dataLoaded.subscribe(loaded => {
      if(loaded) {
        //LogTemplateConfigService.logProviderForm.addControl('logProvider', LogTemplateConfigService.logProviderForm);
        //this.isProviderParamsLoaded = true;
      } else {
        setTimeout(() => {
          this.appDetailService.init();
        }, 10);
      }
    });
    console.log('App Detail: ', this.appDetailService);
    
}

  get checkEditMode(){
    return ApplicationSetupService.editMode;
  } 

cancelForm(){
  this.router.navigate(['/setup/applications']);
    $("[data-toggle='tooltip']").tooltip('hide');
    // this.store.dispatch(ApplicationActions.loadAppList());
}

  // Below function is use to submit applicatio form
  submitApplicationForm() {
    ApplicationSetupService.applicationDetails.markAllAsTouched();    //Touch the fields to see if its invalid
    let createAppData = ApplicationSetupService.applicationDetails;

    if(ApplicationSetupService.applicationDetails.status != "INVALID"){
    this.appDetailService.submitApplicationForm(createAppData).subscribe();
    }else{
      this.toastr.showError('Please check if all the entered fields are correct', 'ERROR');
    }
    console.log("Print Application Detail: ", ApplicationSetupService.applicationDetails);
  }

updateApplicationForm(){
  ApplicationSetupService.applicationDetails.markAllAsTouched();
  if(ApplicationSetupService.applicationDetails.status != "INVALID"){
    let createAppData = ApplicationSetupService.applicationDetails;
    this.appDetailService.updateApplicationForm(createAppData).subscribe();
    // .subscribe(resp => {
    //   this.toastr.showSuccess('Updated application Successfully', 'SUCCESS');
    //   this.appSetupService.showApplicationDetailsComp = false;
    //   this.appSetupService.showServiceDetailsComp = true;
    //   console.log("App setup service: ", this.appSetupService);

    // });
  }else{
        this.toastr.showError('Please Check if all the entered fields are correct', 'ERROR')
      }
}
}
