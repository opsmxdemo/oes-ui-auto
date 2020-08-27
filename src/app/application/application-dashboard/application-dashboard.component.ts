import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import {NotificationService} from '../../services/notification.service';
import * as fromApp from '../../store/app.reducer';
import * as AppDashboardAction from './store/dashboard.actions';
import * as fromApplicationFeature from '../../application-onboarding/store/feature.reducer';
import * as ApplicationActions from '../../application-onboarding/application/store/application.actions';
import * as LayoutAction from '../../layout/store/layout.actions';
import * as DeploymentAcion from '../deployment-verification/store/deploymentverification.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.less']
})

export class ApplicationDashboardComponent implements OnInit {

  nodes= [];                      // getting nodes data for network chart
  clusters: null;                    // getting cluster data for network chart
  links= [];                      // getting edges data for network chart
  networkChartData = null;              // It is use to store network chart data fetched from api.

  applicationFinalData: any[] = [];
  finalLabelArray = [];
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
  oesServiceData: any;
  autoPilotServiceData: any;


  // tslint:disable-next-line:max-line-length
  constructor(private applicationService: ApplicationService, 
              private notifications: NotificationService, 
              public store: Store<fromApp.AppState>,
              public applicationFeatureStore: Store<fromApplicationFeature.State>) { }

  ngOnInit(): void {
   
    //fetching appData from dashboard state
    this.store.select('appDashboard').subscribe(
      (resdata) => {
        if(resdata.appData !== null){
          this.dashboardLoading = resdata.dashboardLoading;
          this.applicationData = resdata.appData;
          this.store.dispatch(new LayoutAction.ApplicationData(this.applicationData.length));
          this.spinnerService = false;
         // this.selectedApplication(0, this.applicationData[0]);
          this.applicationFinalData = resdata.appData;
         
          // code to add new finalLabel in application level
          let index = -1;
          let i = 0;
         
          this.applicationFinalData.forEach((ele,index) => {
            // let j = 0;
            let label = '';
            ele['appInfo'].forEach(e => {
              
              if (e.applicationInfolabel == 'Services') {
                index = i;
                label = e.applicationInfolabel;
              } else if (e.applicationInfolabel === 'Deployment Verification') {
                
                if(label == '' || label != 'Services'){
                  index = i;
                  
                  label = e.applicationInfolabel;
                }
              }
              // j++;
            });
            i++;
            
            this.finalLabelArray.push(label);
          })
          this.selectedApplication(0, this.applicationFinalData[0],this.finalLabelArray[0]);
        }
        if(resdata.topologyChartData !== null){
          this.dashboardLoading = resdata.dashboardLoading;
          this.networkChartData = resdata.topologyChartData;
          // this.nodes = [...resdata.topologyChartData.nodes];
          // this.links = [...resdata.topologyChartData.edges];
          // console.log(this.networkChartData);
         // this.store.dispatch(new LayoutAction.(this.applicationData.length));
        }
      }
    )
  }
  
  // code to load applications
  public getApplications() {
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(AppDashboardAction.loadAppDashboard());
  }

  public selectedApplication(index: number, app: any,appType: string) {
    this.showAppDataType = appType;
    this.applicationService.getServiceList(app.applicationId).subscribe((serviceDataList: any) => {
      this.serviceData = serviceDataList;
      this.oesServiceData = serviceDataList['oesService'];
      this.autoPilotServiceData = serviceDataList['autopilotService'];
      this.spinnerService = false;
      if (this.oesServiceData.length === 0) {
        this.serviceErrorMessage = 'No services found in this application'; 
      }
      if (this.autoPilotServiceData.length === 0) {
        this.serviceErrorMessage = 'No services found in this application'; 
      }
     
    });
    if(this.showAppDataType === 'Services'){
    this.spinnerService = true;
    this.selectedIndex = index;
    this.selectedApplicationName = app.applicationName;
    this.showReleaseTable = false;
    this.serviceErrorMessage = '';
    this.oesServiceData = this.serviceData['oesService'];

    }else{
      this.spinnerService = true;
    this.showAppDataType = 'Deployment Verification';
    this.selectedIndex = index;
    this.selectedApplicationName = app.applicationName;
    this.showReleaseTable = false;
    this.serviceErrorMessage = '';
    this.autoPilotServiceData = this.serviceData['autopilotService'];
    // if (this.autoPilotServiceData.length === 0) {
    //   this.serviceErrorMessage = 'No services found in this application'; 
    // }
   }

    this.nodes = [
      {
        id: 'a1',
        label: 'application',
        data: {
          customColor: '#58a5cc'
        }
      },
      {
        id: 'b1',
        label: 'multiservice_1',
        data: {
          customColor: '#dc3545'
        }
      }, {
        id: 'b2',
        label: 'multiservice_2',
        data: {
          customColor: '#dc3545'
        }
      }, {
        id: 'b3',
        label: 'multiservice_3',
        data: {
          customColor: '#dc3545'
        }
      }, 
      {
        id: 'b4',
        label: 'multiservice_4',
        data: {
          customColor: '#dc3545'
        }
      }
    ];

    this.links = [
      {
        id: 'a',
        source: 'a1',
        target: 'b2',
        label: 'is parent of'
      }, {
        id: 'b',
        source: 'a1',
        target: 'b1',
        label: 'custom label'
      }, {
        id: 'c',
        source: 'a1',
        target: 'b3',
        label: 'custom label'
      },
      {
        id: 'd',
        source: 'a1',
        target: 'b4',
        label: 'custom label'
      }
    ];
  }
  

// redirection to canary reports
  getServiceCanaryReport(canary){
     // hide tooltip 
     $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(DeploymentAcion.loadDeploymentApp({page:'application/deploymentverification'}));
  
    }

  // code related to get releases
  public getReleases(menu: string, application: any, index: number, event: Event) {
    this.spinnerService = true;
    this.applicationService.childApplication = application.applicationName;
    this.selectedApplicationName = application.applicationName;
    this.showAppDataType = menu;
    this.showReleaseTable = true;
    this.applicationService.getReleaseList(application.applicationId).subscribe((releaseList: any) => {
      this.parentReleaseData = releaseList;
      if (releaseList.length === 0){
        this.parentReleaseData.appName = application.applicationName;
        this.parentReleaseData.applicationId = application.applicationId;
        this.parentReleaseData.releaseErrorMessage = 'No recent releases.';
      }
      this.parentReleaseData.appName = application.applicationName;
      this.parentReleaseData.applicationId = application.applicationId;
      this.spinnerService = false;
    });
    event.stopPropagation();
  }
  public getAppDataDetails(index: number, app: any, labelType: string, event: Event) {
    this.showAppDataType = labelType;
    if (labelType === 'Services') {
      this.selectedApplication(index, app, this.showAppDataType);
    //  this.selectedApplication(index, app);
    } else if (labelType === 'Releases') {
      this.getReleases(labelType, app, index, event);
     // this.selectedApplication(index, app);
    } else if (labelType === 'Deployment Verification') {
      this.selectedApplication(index, app, this.showAppDataType);
    }
     else {

    }
    event.stopPropagation();
  }


  public addNewApplication() {
   this.applicationFeatureStore.dispatch(ApplicationActions.loadApp({page:'application'}));
  }

  // Below function is use to get proper href
  redirectLink(ServiceName,applicationName){
    const href = 'http://52.255.164.169:9000/#/applications/'+applicationName+'/executions?pipeline='+ServiceName;
    return href;
  }

  // Below function is use to delete application
  deleteApplication(application: any,index) {
    $("[data-toggle='tooltip']").tooltip('hide');
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        $("[data-toggle='tooltip']").tooltip('hide');
        // this.applicationFeatureStore.dispatch(ApplicationActions.({accountName: account.name,index:index}));
        // this.store.dispatch(AppDashboardAction.loadAppDashboard());
        this.store.dispatch(AppDashboardAction.deleteApplication({applicationId: application.applicationId,index:index}));
      }else{
        //alert('dont delete'); 
      }
    })
  }

  

}
