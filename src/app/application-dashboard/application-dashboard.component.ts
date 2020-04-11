import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { ReleaseComponent } from '../release/release.component';
import { stringify } from 'querystring';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.less']
})

export class ApplicationDashboardComponent implements OnInit {

  public applicationData: any[] = [];
  selectedIndex = 0;
  public serviceData: any[] = [];
  public selectedApplicationName: string;
  showAppDataType = 'Services';
  showReleaseTable = false;
  // public messageToRelease: string;
  public message: string;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationService.getApplicationList().subscribe((response: any) => {
      console.log(response);
      this.applicationData = response;
      this.selectedApplication(0, response[0]);
    });
  }
  public selectedApplication(index: number, app: any) {
    this.showAppDataType = 'Services';
    this.selectedIndex = index;
    this.selectedApplicationName = app.name;
    this.showReleaseTable = false;
    this.applicationService.getServiceList(app.name).subscribe((serviceDataList: any) => {
      console.log(serviceDataList);
      this.serviceData = serviceDataList;
    });
  }
  public getReleases(menu: string, application: string, index: number, event: Event) {
    this.message = application;
    this.applicationService.childApplication = application;
    this.showAppDataType = menu;
    this.showReleaseTable = true;
    console.log(this.showReleaseTable);
    event.stopPropagation();
  }
  public getAppDataDetails(index: number, app: any, labelType: string, event: Event) {
    this.showAppDataType = labelType;
    if (labelType === 'Services') {
      this.selectedApplication(index, app);
      event.stopPropagation();
    } else if (labelType === 'Releases') {
      this.getReleases(labelType, app.name, index, event);
    } else {

    }
  }

}
