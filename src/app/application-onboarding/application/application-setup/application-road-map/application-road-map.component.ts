import { FormGroup } from '@angular/forms';
import { interval } from 'rxjs';
import { createApplication } from './../../store/application.actions';
import { Component, OnInit } from '@angular/core';
import { ApplicationRoadMapService } from './application-road-map.service'

@Component({
  selector: 'app-application-road-map',
  templateUrl: './application-road-map.component.html',
  styleUrls: ['./application-road-map.component.less']
})
export class ApplicationRoadMapComponent implements OnInit {

  servicesForm:any;
  editMode: any;

  constructor(public appRoadMapService: ApplicationRoadMapService) { }
  ngOnChanges(){
  }

  ngOnInit(): void {
    this.appRoadMapService.initChanges();
    // this.createApplicationForm.invalid = false;
    // this.servicesForm.invalid = false;
    // this.environmentForm.invalid = false;
    // this.groupPermissionForm.invalid = false;
    // this.editMode = true;

    //define variables of the Application form
    


    this.appRoadMapService.init();
  }

  loadServiceForm(){

  }
  editServiceClick(serviceArr, i){

  }


}
