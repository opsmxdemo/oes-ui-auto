import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApplicationRoadMapService {

  createApplicationForm: FormGroup;
  servicesForm: any;
  environmentForm: any;
  groupPermissionForm: any;
  editMode: any;

  constructor(public http: HttpClient, public environment: AppConfigService) {
  }

    init(){

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
