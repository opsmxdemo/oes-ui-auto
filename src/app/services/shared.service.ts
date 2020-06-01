
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class SharedService {
  userData: any;
  type: string;
  dataSourceData: any;
  dataSourceType: string;
  endpointUrl: string = null;

  constructor(private httpClient: HttpClient,
              private environment: AppConfigService) {
                
    this.userData = {};
    this.dataSourceData = {};
    this.type = '';
    this.dataSourceType = '';
    this.endpointUrl = environment.config.endPointUrl;
  }

  //Below function is use to validate Application name exist or not through api.i.e, ApplicationComponent
  validateApplicationName(name: string, type: string) {
    return this.httpClient.get(this.endpointUrl + 'oes/appOnboarding/nameCheck/' + name);
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
  setDataSourceData(val: any) {
    this.dataSourceData = val;
  }
  getDataSourceData() {
    return this.dataSourceData;
  }
  setDataSourceType(datasourceType: string){
    this.dataSourceType = datasourceType;
  }
  getDataSourceType(){
    return this.dataSourceType;
  }

  //Below function is use to validate filter name exist or not through api.i.e, AuditComponent
  validateFiltersName(name: string, type: string) {
    return this.httpClient.get(this.endpointUrl + 'oes/audit/filter/nameCheck/' + name);
  }

   //Below function is use to validate policy name exist or not through api.i.e, policyManagementComponent
   validatePolicyName(name: string, type: string) {
    return this.httpClient.get(this.endpointUrl + 'oes/policy/'+ name +'/nameCheck');
  }

   //Below function is use to save data from datasources
   saveData(postData){
    return this.httpClient.post(this.endpointUrl + 'oes/accountsConfig/saveAccount',postData).pipe();
  }

  // Below function to validate the github account exist or not through api
  validateDatasourceName(name:string,type: string){
    return this.httpClient.get(this.endpointUrl + 'oes/accountsConfig/nameCheck/' + name);
  }

  //To verify Git account credentials to fetch cloud account details to use in Spinnaker
  validateGitAccount(){
    return this.httpClient.get(this.endpointUrl + 'oes/accountsConfig/gitAccountExist');
  }

}
