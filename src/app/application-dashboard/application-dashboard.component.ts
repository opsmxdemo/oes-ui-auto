import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { ReleaseComponent } from '../release/release.component';

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
  showReleaseTable = false;
  //public messageToRelease: string;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationService.getApplicationList().subscribe((response: any) => {
      console.log(response);
      this.applicationData = response;
      this.selectedApplication(0, response[0]);
    });
  }
  public selectedApplication(index: number, app: any) {
    this.selectedIndex = index;
    this.selectedApplicationName = app.name;
    this.showReleaseTable = false;
    this.applicationService.getServiceList(app.name).subscribe((serviceDataList: any) => {
      console.log(serviceDataList);
      this.serviceData = serviceDataList;
    });
  }
  public getReleases(application: string, index: number, event: Event) {
    //this.messageToRelease = application;
    this.showReleaseTable = true;
    console.log(this.showReleaseTable);
    event.stopPropagation();
  }
}
