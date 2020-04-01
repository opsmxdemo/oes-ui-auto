import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.less']
})

export class ApplicationDashboardComponent implements OnInit {

  public applicationData: any[] = [];
  public selectedIndex: number = 0;
  public serviceData: any[] = [];
  public selectedApplicationName: string;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationService.getApplicationList().subscribe((response: any) => {
      console.log(response);
      this.applicationData = response;
      //this.serviceData = response[0].services;
      // this.applicationService.getServiceList(response[0].name).subscribe((serviceDataList: any) => {
      //   console.log(serviceDataList);
      //   this.serviceData = serviceDataList;
      // });
      this.selectedApplication(0, response[0]);
    });
  }
  public selectedApplication(index: number, app: any) {
    this.selectedIndex = index;
    this.selectedApplicationName = app.name;
    this.applicationService.getServiceList(app.name).subscribe((serviceDataList: any) => {
      console.log(serviceDataList);
      this.serviceData = serviceDataList;
    });
    
    
  }
}
