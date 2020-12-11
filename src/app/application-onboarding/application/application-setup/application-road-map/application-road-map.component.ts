import { FormGroup } from '@angular/forms';
import { interval } from 'rxjs';
import { createApplication } from './../../store/application.actions';
import { Component, OnInit } from '@angular/core';
import { ApplicationRoadMapService } from './application-road-map.service'
import { ApplicationDetailsService } from "../application-details/application-details.service";

@Component({
  selector: 'app-application-road-map',
  templateUrl: './application-road-map.component.html',
  styleUrls: ['./application-road-map.component.less']
})
export class ApplicationRoadMapComponent implements OnInit {


  constructor(public appRoadMapService: ApplicationRoadMapService, private appDetailService: ApplicationDetailsService) { }

  ngOnInit(): void {
    // this.createApplicationForm.invalid = false;
    // this.servicesForm.invalid = false;
    // this.environmentForm.invalid = false;
    // this.groupPermissionForm.invalid = false;
    // this.editMode = true;
    this.appRoadMapService.init();
    if(this.appDetailService.applicationNameParams != '' && this.appDetailService.applicationNameParams != undefined){
      
    }
  }


}
