import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationSetupService } from './application-setup.service';

@Component({
  selector: 'app-application-setup',
  templateUrl: './application-setup.component.html',
  styleUrls: ['./application-setup.component.less'],
  providers: [ApplicationSetupService]
})
export class ApplicationSetupComponent implements OnInit {
  
  constructor(public service: ApplicationSetupService, private activatedRoute: ActivatedRoute) { } 

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params.id) {
      ApplicationSetupService.id = this.activatedRoute.snapshot.params.id;
    }else{
      ApplicationSetupService.id = 0;
    }
    this.service.init();

  }

get getId() {
    return ApplicationSetupService.id;
}
get appDetail(){
  return ApplicationSetupService.applicationDetails;
}

get callShowAppComp() {
    return ApplicationSetupService.showApplicationDetailsComp;
}
get callShowServiceComp() {
    return ApplicationSetupService.showServiceDetailsComp;
}

}
