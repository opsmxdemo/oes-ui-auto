import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import {NotificationService} from '../../services/notification.service';
import * as fromApp from '../../store/app.reducer';
import * as AppDashboardAction from './store/dashboard.actions';
import * as AppOnboardingAction from '../../application-onboarding/store/onBoarding.actions';
import * as DeploymentAcion from '../deployment-verification/store/deploymentverification.actions';
import * as LayoutAction from '../../layout/store/layout.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { Subject } from 'rxjs';


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
  showAppDataType = '';
  showReleaseTable = false;
  public spinnerService = true;
  public parentReleaseData: any;
  releaseErrorMessage: string;
  dashboardLoading: boolean = true;
  serviceDemoDataList: { canaryId: number; serviceId: number; serviceName: string; finalScore: number; logsScore: number; metricsScore: number; status: string; }[];


  // tslint:disable-next-line:max-line-length
  constructor(private applicationService: ApplicationService, private notifications: NotificationService, public store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
   
    //fetching appData from dashboard state
    this.store.select('appDashboard').subscribe(
      (resdata) => {
        if(resdata.appData !== null){
          this.dashboardLoading = resdata.dashboardLoading;
          this.applicationData = resdata.appData;
          this.store.dispatch(new LayoutAction.ApplicationData(this.applicationData.length));
          this.spinnerService = false;
          this.selectedApplication(0, this.applicationData[0]);
        }
      }
    )
  }
  
  // code to load applications
  public getApplications() {
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(AppDashboardAction.loadAppDashboard());
  }

  public selectedApplication(index: number, app: any) {
    if(this.showAppDataType === 'Services'){
    this.spinnerService = true;
    this.selectedIndex = index;
    this.selectedApplicationName = app.applicationName;
    this.showReleaseTable = false;
    this.serviceErrorMessage = '';
    this.applicationService.getServiceListDemo(app.applicationId).subscribe((serviceDataList: any) => {
      this.serviceData = serviceDataList;
      this.spinnerService = false;
      if (serviceDataList.length === 0) {
        this.serviceErrorMessage = 'No services found in this application'; 
      }
    });
    }else{
      this.spinnerService = true;
    this.showAppDataType = 'Deployment Verification';
    this.selectedIndex = index;
    this.selectedApplicationName = app.applicationName;
    this.showReleaseTable = false;
    this.serviceErrorMessage = '';
    this.applicationService.getServiceList(app.applicationName).subscribe((serviceDataList: any) => {
      this.serviceData = serviceDataList;
      this.spinnerService = false;
      if (serviceDataList.length === 0) {
        this.serviceErrorMessage = 'No services found in this application'; 
      }
    });
    }

    
  }
  

// redirection to canary reports
  getServiceCanaryReport(canary){
     // hide tooltip 
     $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(DeploymentAcion.loadDeploymentApp({page:'application/deploymentverification'}));
  
    }

  public getReleases(menu: string, application: any, index: number, event: Event) {
    this.spinnerService = true;
    this.applicationService.childApplication = application.applicationName;
    this.selectedApplicationName = application.applicationName;
    this.showAppDataType = menu;
    this.showReleaseTable = true;
    this.applicationService.getReleaseList(application.applicationName).subscribe((releaseList: any) => {
      this.parentReleaseData = releaseList;
      if (releaseList.length === 0){
        this.parentReleaseData.appName = application.applicationName;
        this.parentReleaseData.releaseErrorMessage = 'No recent releases.';
      }
      this.parentReleaseData.appName = application.applicationName;
      this.spinnerService = false;
    });
    event.stopPropagation();
  }
  public getAppDataDetails(index: number, app: any, labelType: string, event: Event) {
    this.showAppDataType = labelType;
    if (labelType === 'Services') {
      this.selectedApplication(index, app);
    //  this.selectedApplication(index, app);
    } else if (labelType === 'Releases') {
      this.getReleases(labelType, app, index, event);
     // this.selectedApplication(index, app);
    } else if (labelType === 'Deployment Verification') {
      this.selectedApplication(index, app);
    }
     else {

    }
    event.stopPropagation();
  }


  public addNewApplication() {
   this.store.dispatch(AppOnboardingAction.loadApp({page:'application'}));
  }

  // Below function is use to get proper href
  redirectLink(ServiceName,applicationName){
    const href = 'http://52.255.164.169:9000/#/applications/'+applicationName+'/executions?pipeline='+ServiceName;
    return href;
  }

  

}
