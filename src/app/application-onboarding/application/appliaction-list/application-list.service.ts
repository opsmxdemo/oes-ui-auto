import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ApplicationSetupService } from '../application-setup/application-setup.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationListService {
  editMode: boolean;
  applicationName: string;
  applicationId: number;


  constructor(public http: HttpClient, public router: Router, public environment: AppConfigService, public appSetupService: ApplicationSetupService) {
  }

  editApplicationAPI(applicationId){
           return this.http.get<any>(this.environment.config.endPointUrl + 'platformservice/v1/applications/' + applicationId);
  }
  editApplication(appData){
    // this.store.dispatch(ApplicationActions.enableEditMode({ editMode: true, applicationName: appData.name,page:'/setup/applications',applicationId:appData.applicationId}));
    this.editMode = true;
    this.applicationId = appData.applicationId;
    this.applicationName = appData.name;
    this.appSetupService.showApplicationDetailsComp = true;
    this.appSetupService.showServiceDetailsComp = false;
  }
  callSetupComponent(){
          this.appSetupService.showApplicationDetailsComp = true;
          this.appSetupService.showServiceDetailsComp = false;

  }

}
