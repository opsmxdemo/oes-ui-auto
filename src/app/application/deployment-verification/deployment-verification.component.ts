import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-deployment-verification',
  templateUrl: './deployment-verification.component.html',
  styleUrls: ['./deployment-verification.component.less']
})
export class DeploymentVerificationComponent implements OnInit {
  showCommonInfo: string;

  constructor(public sharedService: SharedService, public autopilotService: AutopiloService, public notifications: NotificationService) { }

  ngOnInit(): void {
    this.showCommonInfo = 'show';
    //this.sharedService.setCommonInfo(this.showCommonInfo);

    // this.autopilotService.getDefaultRun().subscribe(response) => {

    // }

    // this.autopilotService.getDefaultRun().subscribe((response: any) => {
    //   if(response.status === 200){
       
    //   }
    // },
    // (error) => {
    //   this.notifications.showError("Error",error.message);
    // });

  }
  
  
  

}
