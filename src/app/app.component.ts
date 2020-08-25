import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import * as AuditActions from './audit/store/audit.actions';
import * as CdDashboardActions from './cd-dashboard/store/cd-dashboard.actions';
import * as PolicyActions from './policy-management/store/policyManagement.actions';
import * as OnboardingApplicationActions from './application-onboarding/application/store/application.actions';
import * as DataSourceActions from './application-onboarding/data-source/store/data-source.actions';
import * as AppDashboardAction from './application/application-dashboard/store/dashboard.actions';
import * as DeploymentVerificationAction from './application/deployment-verification/store/deploymentverification.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';
import * as $ from 'jquery';
import 'bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from './services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'OES';
  addclass = false;
  isAuthenticate = false;
  Sidebar: Menu;
  applicationCount: number = 0;
  endpointUrl: string;

  constructor(public store: Store<fromApp.AppState>,
              private router: Router,
              private route: ActivatedRoute,
              public environment: AppConfigService) {
                this.endpointUrl = environment.config.endPointUrl;
               }
  // For tooltip
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    $('[data-toggle="dropdown"]').dropdown();
    $('[data-toggle="popover"]').popover();
  }
  ngOnInit() {

    //Dispatching action for autoLogin functionality
    this.store.dispatch(new AuthAction.AutoLoginStart());

    //fetching data from AuthState    
    this.store.select('auth').subscribe(
      (response) => {
        this.isAuthenticate = response.authenticated;
        if (!this.isAuthenticate && response.autologinSucceed) {
          this.router.navigate(['login']);
        }else if(response.autologinSucceed && this.isAuthenticate){
          //Dispatching action to fetch Sidebar Menu
          this.store.dispatch(new LayoutAction.LoadPage());

          //Dispatching action to fetch application dashboard data from API
          this.store.dispatch(AppDashboardAction.loadAppDashboard());

          //Dispatching action to fetch Cd dashboard data from API
          this.store.dispatch(CdDashboardActions.loadCdDashboard());

          //Dispatching action to fetch application Onboarding data from API
          this.store.dispatch(OnboardingApplicationActions.loadAppList());

          //Dispatch action to fetch Supported Data Source data from API  
          this.store.dispatch(DataSourceActions.loadDatasource());

          //Dispatching action to fetch audit initial data
          this.store.dispatch(AuditActions.loadAudit());

          //Dispatching action for policy management initial data
         this.store.dispatch(PolicyActions.loadPolicy({relatedTab:'DYNAMIC'}));

        }
      }
    );

    // fetching data from LayoutState
    this.store.select('layout').subscribe(
      (response) => {
        this.Sidebar = response.menu;
        this.applicationCount = response.appliactionData;
        // if(response.apiErrorCounter.length > 0){
        //   this.router.navigate(['error']);
        // }
      }
    );

    // fetching data from application dashboard State
    this.store.select('appDashboard').subscribe(
      (response) => {
        if(response.appData !== null){
          this.store.dispatch(new LayoutAction.ApplicationData(response.appData.length));
        }
      }
    )
     
    // fetching current route if deploymentVerification is exist then collapse left side menu.
    setTimeout(()=>{
      if(this.router.url.includes('deploymentverification')){
        this.addclass = true;
      }
    },1000)
  }
  // platform-service-ui

  toggleNavbar() {
    this.addclass = !this.addclass;
    this.store.dispatch(new LayoutAction.SideBarToggle(!this.addclass === false?'false':'true'));
  }

  // Below function is use to nevigate to proper page while click on submenu link
  navigateMenu(event,menuName){
    event.stopPropagation();
    if(menuName === 'Deployment Verification'){
      setTimeout(()=>{
        this.addclass = true;
      },1000)
    }
  }

  // Below function is use to return appropriate class for submenu link
  subMenuclass(link){
    const linkArr = link.split('/');
    let linkClass = linkArr[linkArr.length-1];
    return linkClass;
  }
  
}
