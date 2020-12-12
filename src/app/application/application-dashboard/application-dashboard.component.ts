import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ApplicationService } from '../../services/application.service';
import { NotificationService } from '../../services/notification.service';
import * as fromApp from '../../store/app.reducer';
import * as AppDashboardAction from './store/dashboard.actions';
import * as fromApplicationFeature from '../../application-onboarding/store/feature.reducer';
import * as ApplicationActions from '../../application-onboarding/application/store/application.actions';
import * as LayoutAction from '../../layout/store/layout.actions';
import * as DeploymentAcion from '../deployment-verification/store/deploymentverification.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { AppConfigService } from 'src/app/services/app-config.service';
import { arraysAreNotAllowedMsg } from '@ngrx/store/src/models';
import { NumericLiteral } from 'typescript';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.less']
})

export class ApplicationDashboardComponent implements OnInit {


  subscription: Subscription;
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
  cnt = 0;
  cnt2 = 0;
  statusMessage: string;
  finalSelectedTabNumber: number = -1;
  previouSelectedApp: any;
  finalApplicationId: any;

  nodes = [];                      // getting nodes data for network chart
  clusters: null;                    // getting cluster data for network chart
  links = [];                      // getting edges data for network chart
  networkChartData = null;              // It is use to store network chart data fetched from api.
  serviceErrorMessageSapor: string;
  serviceErrorMessageAutopilot: string;
  servicesInfoData: any;
  featureList: any;
  configuredFeature: any = {}
  isFeaturePresent: any = {}
  selectedFeature = [];
  serviceSidebar: boolean;
  releaseSidebar: boolean;




  // tslint:disable-next-line:max-line-length
  constructor(private applicationService: ApplicationService,
    private notifications: NotificationService,
    public store: Store<fromApp.AppState>,
    public applicationFeatureStore: Store<fromApplicationFeature.State>,
    private environment: AppConfigService,
    private router: Router) { }

  scrollToActiveClass(): void {
    var $container = $("html,body");
    var $scrollTo = $('.active');
    // $container.animate({scrollTop: $scrollTo.offset().top  - $container.offset().top + $container.scrollTop(), scrollLeft: 0},1000); 
    $container.animate({ scrollTop: $scrollTo.offset().top - 115, scrollLeft: 0 }, 500);
  }
  ngOnInit(): void {
    //fetching appData from dashboard state

    this.finalSelectedTabNumber = 0;
    this.store.select('appDashboard').subscribe(
      (resdata) => {
        if (resdata.appData != null) {
          this.dashboardLoading = resdata.dashboardLoading;
          this.applicationData = resdata.appData;
          this.supportVisibility(resdata.appData);
          this.store.dispatch(new LayoutAction.ApplicationData(this.applicationData.length));
          this.spinnerService = false;
          this.applicationFinalData = resdata.appData;
          if (this.previouSelectedApp != null) {
            this.previouSelectedApp = this.previouSelectedApp;
          } else {
            this.previouSelectedApp = this.applicationFinalData[0];
          }
          // code to add new finalLabel in application level
          let index = -1;
          let i = 0;

          resdata.appData.forEach((ele, index) => {
            // if(!ele['visibilityFlag']){
            //   ele['activeCount'] = 0;
            // }
            let label = '';
            ele['appInfo'].forEach(e => {

              if (e.applicationInfolabel == 'Services') {
                index = i;
                label = e.applicationInfolabel;
              } else if (e.applicationInfolabel === 'Deployment Verification') {

                if (label == '' || label != 'Services') {
                  index = i;

                  label = e.applicationInfolabel;
                }
              }
            });
            i++;

            this.finalLabelArray.push(label);
          })
          if (this.showAppDataType === '') {
            this.showAppDataType = this.finalLabelArray[0];
          } else {
            this.showAppDataType = this.showAppDataType;
          }

          this.selectedApplication(this.finalSelectedTabNumber, this.previouSelectedApp, this.showAppDataType);

        }
        if (resdata.topologyChartData != null) {
        //  this.dashboardLoading = resdata.dashboardLoading;
          this.networkChartData = resdata.topologyChartData;
          // this.nodes = [...resdata.topologyChartData.nodes];
          // this.links = [...resdata.topologyChartData.edges];
          // console.log(this.networkChartData);
          // this.store.dispatch(new LayoutAction.(this.applicationData.length));
        }
      });
    const source = interval(this.environment.config.setApplicationInterval);
    this.subscription = source.subscribe(val => this.getApplications());

    //fetching data from layout state
    this.store.select('layout').subscribe(
      (layoutRes) => {
        if (layoutRes.supportedFeatures != null) {
          this.featureList = layoutRes.supportedFeatures;
        }
      }
    )

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // code to load applications
  public getApplications() {
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(AppDashboardAction.loadAppDashboard());
    this.scrollToActiveClass();
  }

  public selectedApplication(index: number, app: any, appType: string) {
    this.finalSelectedTabNumber = index;
    this.previouSelectedApp = app;
    this.showAppDataType = appType;
    var appPresent = true
    for (let i = 0; i < this.applicationFinalData.length; i++) {
      if ((this.previouSelectedApp && this.previouSelectedApp.applicationId) ==  (this.applicationFinalData[i] && this.applicationFinalData[i].applicationId)) {
        appPresent = true
        break;
      }
      else {
        appPresent = false
      }
    }

    if (app && app.applicationId && appPresent == true) {
      this.applicationService.getServiceInfo(app.applicationId).subscribe((response: any) => {
        this.servicesInfoData = response.services;
        this.servicesInfoData.forEach((ele, index) => {
          if (ele.id && appType === 'Services') {
            this.applicationService.getFeaturesConfiguredService(ele.id).subscribe((response: any) => {
              this.configuredFeature[ele.id] = response.configuredFeatures ? response.configuredFeatures : [];
              this.featureList.forEach(fea => {
                if(!this.isFeaturePresent[ele.id]) this.isFeaturePresent[ele.id] = {};
                this.isFeaturePresent[ele.id][fea] = false;
              });
              this.configuredFeaturepresent(ele.id);
            },
              (error) => {
                this.statusMessage = 'error';              //Error callback
              });
          } else {
          }
        });
      });
      this.applicationService.getServiceList(app.applicationId).subscribe((serviceDataList: any) => {
        this.serviceData = serviceDataList;
        this.oesServiceData = serviceDataList['oesService'];
        this.autoPilotServiceData = serviceDataList['autopilotService'];
        this.spinnerService = false;
        if (this.oesServiceData === null || this.oesServiceData.length === 0) {
          this.serviceErrorMessageSapor = 'No services found in this application.';
        }
        if (this.autoPilotServiceData === null || this.autoPilotServiceData.length === 0) {
          this.serviceErrorMessageAutopilot = 'No services found in this application.';
        }
      },
        (error) => {
          this.statusMessage = 'error';              //Error callback
          this.serviceErrorMessage = error;
        }
      );
    } else {

    }

    if (this.showAppDataType === 'Services') {
      this.spinnerService = true;
      this.selectedIndex = index;
      if (app && app.applicationName) {
        this.selectedApplicationName = app.applicationName;
      } else {

      }
      this.showReleaseTable = false;
      this.serviceErrorMessage = '';
      this.oesServiceData = this.serviceData['oesService'];

    } else {
      this.spinnerService = true;
      this.showAppDataType = 'Deployment Verification';
      this.selectedIndex = index;
      if (app && app.applicationName) {
        this.selectedApplicationName = app.applicationName;
      } else {

      }
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
  getServiceCanaryReport(canary) {
    // hide tooltip 
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(DeploymentAcion.loadDeploymentApp({ page: 'application/deploymentverification' }));

  }

  // code related to get releases
  public getReleases(menu: string, application: any, index: number, event: Event) {
    // this.subscription.unsubscribe();
    this.spinnerService = true;
    this.applicationService.childApplication = application.applicationName;
    this.selectedApplicationName = application.applicationName;
    this.showAppDataType = menu;
    this.showReleaseTable = true;
    this.applicationService.getReleaseList(application.applicationId).subscribe((releaseList: any) => {
      this.parentReleaseData = releaseList;
      if (releaseList.length === 0) {
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
  public getAppDataDetails(index: number, app: any, labelType: string, event: Event, subIndex: number) {
    this.showAppDataType = labelType;
    this.finalSelectedTabNumber = index;
    if (labelType === 'Services') {
      this.selectedApplication(this.finalSelectedTabNumber, app, this.showAppDataType);
      setTimeout(() => {
        this.serviceSidebar = true;
      }, 200);
      //  this.selectedApplication(index, app);
    } else if (labelType === 'Releases') {
      this.subscription.unsubscribe();
      this.getReleases(labelType, app, subIndex, event);
      setTimeout(() => {
        this.releaseSidebar = true;
      }, 200);

      // this.selectedApplication(index, app);
    } else if (labelType === 'Deployment Verification') {
      this.selectedApplication(this.finalSelectedTabNumber, app, this.showAppDataType);
    }
    else {

    }
    event.stopPropagation();
  }


  addNewApplication() {
    this.applicationFeatureStore.dispatch(ApplicationActions.loadApp({ page: 'application' }));
  }

  // Below function is use to get proper href
  redirectLink(ServiceName, applicationName) {
    const href = 'http://52.255.164.169:9000/#/applications/' + applicationName + '/executions?pipeline=' + ServiceName;
    return href;
  }

  supportVisibility(appD:any) {
    let appFinal = new Array(this.applicationFinalData.length);

    appD.forEach((ele, index) => {
      let appVar = { ...ele };
      if (appVar['visibilityFlag']) {
        this.applicationService.getActiveGateCount(ele.applicationId).subscribe((activeCountNumber: any) => {
          appVar['activeCount'] = activeCountNumber.activeCount;
          appFinal[index] = appVar;
          this.applicationFinalData = appFinal;
        },
          (error) => {
            this.statusMessage = 'error';              //Error callback
          });
      } else {
        appFinal[index] = appVar;
      }
    });
    this.applicationFinalData = appFinal;
  }

  // Below function is use to delete application
  deleteApplication(application: any, index) {
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

        this.store.dispatch(AppDashboardAction.deleteApplication({applicationName: application.applicationName, applicationId: application.applicationId, index: index }));
        this.selectedApplication(0, this.applicationFinalData[0], this.finalLabelArray[0])
      } else {

      }
    })
  }

  //configured feature for a service
  configuredFeaturepresent(serviceId) {

      if(!this.isFeaturePresent[serviceId]) this.isFeaturePresent[serviceId] = {};

      for (let j = 0; j < this.featureList.length; j++) {
        if (this.configuredFeature[serviceId].includes(this.featureList[j].toLowerCase())) {
          this.isFeaturePresent[serviceId][this.featureList[j].toLowerCase()] = true;
        } else {
          this.isFeaturePresent[serviceId][this.featureList[j].toLowerCase()] = false;
        }
      }
    // }

  }

  routeToDV(envir: any, index: number) {
    let length = this.applicationFinalData[index].recentCanaries ? this.applicationFinalData[index].recentCanaries.length : 0;
    let url = '';
    switch (envir) {
      case 'prod':
        if(length >= 3) {
          url = `/application/deploymentverification/${this.applicationFinalData[index].applicationName}/${this.applicationFinalData[index].recentCanaries[0].canaryId}`
        }
        break;
      case 'staging':
        if(length >= 2) {
          url = `/application/deploymentverification/${this.applicationFinalData[index].applicationName}/${this.applicationFinalData[index].recentCanaries[1].canaryId}`
        }
        break;
      case 'qa':
        if(length == 1) {
          url = `/application/deploymentverification/${this.applicationFinalData[index].applicationName}/${this.applicationFinalData[index].recentCanaries[0].canaryId}`
        }
        if(length == 2) {
          url = `/application/deploymentverification/${this.applicationFinalData[index].applicationName}/${this.applicationFinalData[index].recentCanaries[1].canaryId}`
        }
        if(length >= 3) {
          url = `/application/deploymentverification/${this.applicationFinalData[index].applicationName}/${this.applicationFinalData[index].recentCanaries[2].canaryId}`
        }
        break;
    }
    this.router.navigate([url]);
  }

  getScoreOfCanary(envir, index) {
    let length = this.applicationFinalData[index].recentCanaries ? this.applicationFinalData[index].recentCanaries.length : 0;
    let val = '-';
    switch (envir) {
      case 'prod':
        if(length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        break;
      case 'staging':
        if(length >= 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        break;
      case 'qa':
        if(length == 1) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        if(length == 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        if(length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[2].finalScore;
        }
        break;
    }
    return val || '-';
  }

  setBackground(envir, index) {
    let length = this.applicationFinalData[index].recentCanaries ? this.applicationFinalData[index].recentCanaries.length : 0;
    let val = '-';
    switch (envir) {
      case 'prod':
        if (length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        break;
      case 'staging':
        if (length >= 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        break;
      case 'qa':
        if (length == 1) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        if (length == 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        if (length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[2].finalScore;
        }
        break;
    }
    if (+val == 0 || val != '-') {
      if (+val <= 60) {
        return '#cb5347';
      } else if (+val <= 80) {
        return '#f2b017'
      } else if (+val > 80) {
        return '#4fa845';
      }
    } else  {
      return '';
    }
    
  }

  setBackgroundApproval(envir, index) {
    let length = this.applicationFinalData[index].recentCanaries ? this.applicationFinalData[index].recentCanaries.length : 0;
    let val = '-';
    switch (envir) {
      case 'prod':
        if (length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        break;
      case 'staging':
        if (length >= 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        break;
      case 'qa':
        if (length == 1) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        if (length == 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        if (length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[2].finalScore;
        }
        break;
    }
    if (+val == 0 || val != '-') {
      if (+val <= 60) {
        return '#cb5347';
      } else {
        return '#4fa845';
      }
    } else  {
      return '';
    }
    
  }

  setColor(envir, index) {
    let length = this.applicationFinalData[index].recentCanaries ? this.applicationFinalData[index].recentCanaries.length : 0;
    let val = '-';
    switch (envir) {
      case 'prod':
        if (length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        break;
      case 'staging':
        if (length >= 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        break;
      case 'qa':
        if (length == 1) {
          val = this.applicationFinalData[index].recentCanaries[0].finalScore;
        }
        if (length == 2) {
          val = this.applicationFinalData[index].recentCanaries[1].finalScore;
        }
        if (length >= 3) {
          val = this.applicationFinalData[index].recentCanaries[2].finalScore;
        }
        break;
    }
    if (+val == 0 || val != '-') {
      return 'white';
    } else  {
      return '';
    }
    
  }

  hideSidebar() {
    setTimeout(() => {
      this.serviceSidebar = false;
      this.releaseSidebar = false;
    }, 200);
  }

  depVerExist(applicationInfo: any, index) {
    if(index == 0) 
      console.log(this.applicationFinalData);
      
    return index == 1 && applicationInfo.applicationInfolabel == 'Deployment Verification';
  }

  routeToV(application: any, envir) {
    this.router.navigate(['/application/visibility',application.applicationName,application.applicationId]);
  }

}
