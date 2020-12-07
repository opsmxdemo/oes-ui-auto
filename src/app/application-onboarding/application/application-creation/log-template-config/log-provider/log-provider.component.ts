import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { OpsMxForms } from 'projects/forms/src/public-api';
import { LogProviderService } from './log-provider.service';
import { LogTemplateConfigService } from '../log-template-config.service'

@Component({
  selector: 'app-log-provider',
  templateUrl: './log-provider.component.html',
  styleUrls: ['./log-provider.component.less'],
  providers :[LogProviderService]
})
export class LogProviderComponent implements OnInit {

  formObj: FormGroup = new FormGroup({});
  //isProviderParamsLoaded = false;
  selectedDataSource :any;
  editMode: boolean;
  
  constructor(public logProviderService: LogProviderService) {
    //super();
  }

  ngOnInit(): void {
    this.logProviderService.initProviderComponent();
    // this.logProviderService.getDataScources().subscribe(resp => {
    //   this.isProviderParamsLoaded = true;
    // });
    this.logProviderService.$logTemplateDataLoaded.subscribe(loaded => {
      if(loaded) {
        //LogTemplateConfigService.logProviderForm.addControl('logProvider', LogTemplateConfigService.logProviderForm);
        //this.isProviderParamsLoaded = true;
      } else {
        setTimeout(() => {
          this.logProviderService.initProviderComponent();
        }, 10);
      }
    });
    
  }

  onChange(event) {
    console.log(event);
  }

  onChangeProvider(event: any) {
    console.log(event);
    // this.selectedDataSource = event.target.value;
    this.logProviderService.getAccountForProvdier().subscribe(resp => {})
    //api to get response key based on account name
    //return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/logs/getDataSourceResponseKeys?accountName='+action.accountName)
    
    //api to get list of accounts
    //return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials?datasourceType='+action.monitoringSourceName)
  }

  onChangeAccounts(event: any) {
    console.log(event);
    // this.selectedDataSource = event.target.value;
    this.logProviderService.getResponseForElastic().subscribe(resp => {})
    //api to get response key based on account name
    //return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/logs/getDataSourceResponseKeys?accountName='+action.accountName)
    
    //api to get list of accounts
    //return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials?datasourceType='+action.monitoringSourceName)
  }


  formValid(){

  }

  formInvalid(){
    
  }

  get logProviderForm() {
    return LogTemplateConfigService.logProviderForm;
  }

  enableRegExp(event) {
    this.logProviderService.setRegExp();
    // this.logProviderService.setAutoBaseLIne();
  }

  enableAutoBase(event) {
    this.logProviderService.setAutoBaseLIne();
  }

  get EditModeStatus() {
    return this.logProviderService.getEditStatus();
  }

}
