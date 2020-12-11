import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ApplicationDetailsService } from './application-details.service';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.less'],
  providers :[ApplicationDetailsService]
})
export class ApplicationDetailsComponent implements OnInit {

  constructor(public appDetailService: ApplicationDetailsService) { }

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


}
