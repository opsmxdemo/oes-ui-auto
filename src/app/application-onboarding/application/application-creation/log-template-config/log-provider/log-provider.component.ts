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
export class LogProviderComponent extends OpsMxForms implements OnInit {

  formObj: FormGroup = new FormGroup({});
  isProviderParamsLoaded = false;
  
  constructor(public logProviderService: LogProviderService) {
    super();
  }

  ngOnInit(): void {
    this.logProviderService.initProviderComponent(); 
    this.logProviderService.$logTemplateDataLoaded.subscribe(loaded => {
      if(loaded) {
        this.formObj.addControl('logProvider', LogTemplateConfigService.logProviderForm);
        this.isProviderParamsLoaded = true;
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

  formValid(){

  }

  formInvalid(){
    
  }

  get logProviderForm() {
    return LogTemplateConfigService.logProviderForm;
  }


}
