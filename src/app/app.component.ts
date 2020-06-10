import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import * as AuditActions from './audit/store/audit.actions';
import * as PolicyActions from './policy-management/store/policyManagement.actions';
import * as OnboardingActions from './application-onboarding/store/onBoarding.actions';
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
  title = 'OES-UI';
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
  }
  ngOnInit() {

    //Dispatching action for login functionality
    this.store.dispatch(new AuthAction.LoginStart());

    //fetching data from AuthState
    this.store.select('auth').subscribe(
      (response) => {
        this.isAuthenticate = response.authenticated;
        if (response.authResponse === null) {
          var browserUrl = window.location.href;
          var arr = browserUrl.split("/");
          var resultUrl = arr[0] + "//" + arr[2] + "/application";
          var encodedUrl = encodeURIComponent(resultUrl);
          this.loginRedirect(encodedUrl)
        }else if(response.authResponse === 'success'){

          //Dispatching action to fetch Sidebar Menu
          this.store.dispatch(new LayoutAction.LoadPage());

          //Dispatching action to fetch application dashboard data from API
          this.store.dispatch(AppDashboardAction.loadAppDashboard());

          //Dispatching action to fetch application Onboarding data from API
          this.store.dispatch(OnboardingActions.loadAppList());

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
  }

  loginRedirect(callback): void {
    window.location.href = `${this.endpointUrl}auth/redirectauto?to=${callback}`;
  }

  toggleNavbar() {
    this.addclass = !this.addclass;
  }

  // Below function is use to nevigate to proper page while click on submenu link
  navigateMenu(event){
    event.stopPropagation();
  }

  // Below function is use to return appropriate class for submenu link
  subMenuclass(link){
    const linkArr = link.split('/');
    let linkClass = linkArr[linkArr.length-1];
    return linkClass;
  }
  
}
