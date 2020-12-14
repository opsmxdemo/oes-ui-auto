import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationSetupService {

  public static id: number = 0;
  public static applicationDetails: any = {};
  showApplicationDetailsComp: boolean = true;
  showServiceDetailsComp: boolean;

  constructor(public http: HttpClient) { }

  init() {
    this.getAppDetails();
  }

  getAppDetails() {
    // call get app details api function this.getApplications() if id > 0
    // else assign an empty object same as the get api response
    // assign it to applicationDetails variable
  }

  getApplications() {
    // call api with the this.id
  }

}
