import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import {NotificationService} from '../services/notification.service';
import * as fromApp from '../store/app.reducer';
import * as AppOnboardingAction from '../application-onboarding/store/onBoarding.actions';
import * as LayoutAction from '../layout/store/layout.actions';
import { Store } from '@ngrx/store';

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
  public serviceErrorMessage: string;
  showAppDataType = 'Services';
  showReleaseTable = false;
  public spinnerService = true;
  public parentReleaseData: any;
  releaseErrorMessage: string;


  // tslint:disable-next-line:max-line-length
  constructor(private applicationService: ApplicationService, private notifications: NotificationService, public store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.getApplications();
  }
  // code to load applications
  public getApplications() {
    this.applicationService.getApplicationList().subscribe((response: any) => {
      this.store.dispatch(new LayoutAction.ApplicationData(response.length));
      this.applicationData = response;
      this.spinnerService = false;
      this.selectedApplication(0, response[0]);
     // this.notifications.showError('error','errorMessage');
    });
  }
  public selectedApplication(index: number, app: any) {
    this.spinnerService = true;
    this.showAppDataType = 'Services';
    this.selectedIndex = index;
    this.selectedApplicationName = app.name;
    this.showReleaseTable = false;
    this.serviceErrorMessage = '';
    this.applicationService.getServiceList(app.name).subscribe((serviceDataList: any) => {
      this.serviceData = serviceDataList;
      this.spinnerService = false;
      if (serviceDataList.length === 0) {
        this.serviceErrorMessage = 'No services found in this application'; 
      }
    });
  }
  public getReleases(menu: string, application: any, index: number, event: Event) {
    this.spinnerService = true;
    this.applicationService.childApplication = application.name;
    this.selectedApplicationName = application.name;
    this.showAppDataType = menu;
    this.showReleaseTable = true;
    this.applicationService.getReleaseList(application.name).subscribe((releaseList: any) => {
      this.parentReleaseData = releaseList;
      if (releaseList.length === 0){
        this.parentReleaseData.appName = application.name;
        this.parentReleaseData.releaseErrorMessage = 'No recent releases.';
      }
      this.parentReleaseData.appName = application.name;
      this.spinnerService = false;
    });
    event.stopPropagation();
  }
  public getAppDataDetails(index: number, app: any, labelType: string, event: Event) {
    this.showAppDataType = labelType;
    if (labelType === 'Services') {
      this.selectedApplication(index, app);
    } else if (labelType === 'Releases') {
      this.getReleases(labelType, app, index, event);
    } else {

    }
    event.stopPropagation();
  }

  public addNewApplication() {
   this.store.dispatch(AppOnboardingAction.loadApp({page:'appdashboard'}));
  }

  // Below function is use to get proper href
  redirectLink(ServiceName,applicationName){
    const href = 'http://52.255.164.169:9000/#/applications/'+applicationName+'/executions?pipeline='+ServiceName;
    return href;
  }

}
