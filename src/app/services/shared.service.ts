
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SharedService {
  userData: any;
  type: string;

  constructor(private httpClient: HttpClient) {
    this.userData = {};
    this.type = '';
  }

  //Below function is use to validate Application name exist or not through api.i.e, ApplicationComponent
  validateApplicationName(name: string, type: string) {
    return this.httpClient.get(environment.endPointUrl + 'oes/appOnboarding/nameCheck/' + name);
  }
  setUserData(val: any) {
    this.userData = val;
  }
  getUserData() {
    return this.userData;
  }
  setAccountType(accountType: string){
    this.type = accountType;
  }
  getAccountType(){
    return this.type;
  }

  //Below function is use to validate filter name exist or not through api.i.e, ApplicationComponent
  validateFiltersName(name: string, type: string) {
    return this.httpClient.get(environment.endPointUrl + 'oes/audit/filter/nameCheck/' + name);
  }

   //Below function is use to validate policy name exist or not through api.i.e, policyManagementComponent
   validatePolicyName(name: string, type: string) {
    return this.httpClient.get(environment.endPointUrl + 'oes/policy/'+ name +'/nameCheck');
  }

   //Below function is use to save data from datasources
   saveData(postData){
    return this.httpClient.post(environment.endPointUrl + 'oes/accountsConfig/saveAccount',postData).pipe();
  }
}
