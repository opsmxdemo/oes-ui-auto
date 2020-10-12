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
  apiError = false;
  Sidebar: Menu;
  applicationCount: number = 0;
  endpointUrl: string;
  installationMode = '';

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

          //Dispatching action to fetch Cd dashboard data from API
          this.store.dispatch(CdDashboardActions.loadCdDashboard());

          //Dispatching action to fetch application Onboarding data from API
          this.store.dispatch(OnboardingApplicationActions.loadAppList());

          //Dispatch action to fetch Supported Data Source data from API  
          this.store.dispatch(DataSourceActions.loadDatasource());

          // Below function is use to dispatch action based on installation mode
          this.initialData(this.installationMode);
        }
      }
    );

    // fetching data from LayoutState
    this.store.select('layout').subscribe(
      (response) => {
        if(this.isAuthenticate){
          this.Sidebar = response.menu;
          this.applicationCount = response.appliactionData;
          this.installationMode = response.installationMode;
          if(response.apiErrorCollection.indexOf(true) > -1){
            this.apiError = true;
            this.router.navigate(['error']);
          }else{
            const url = this.router.url;
            if(url.includes('error')){
              this.apiError = false;
              this.router.navigate(['application']);
            }
          }
        }
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

  // Dispatch actions to fetch initial data of component based on installation mode.
  initialData(mode){
    if(mode !== undefined && mode !== ''){
      if(mode.includes('OES')){
        //Dispatching action to fetch audit initial data
        this.store.dispatch(AuditActions.loadAudit());

        //Dispatching action for policy management initial data
        this.store.dispatch(PolicyActions.loadPolicy({relatedTab:'DYNAMIC'}));
      }
    }else{
      setTimeout(()=>{
        this.initialData(this.installationMode);
      },500)
    }
    

  }

  loginRedirect(callback): void {
    window.location.href = `${this.endpointUrl}auth/redirectauto?to=${callback}`;
  }

  toggleNavbar() {
    this.addclass = !this.addclass;
    //this.store.dispatch(new LayoutAction.SideBarToggle(!this.addclass === false?'false':'true'));
  }

  // Below function is use to nevigate to proper page while click on submenu link
  navigateMenu(event,menuName){
    event.stopPropagation();
    if (menuName === 'Deployment Verification' || menuName === 'Trend Analysis') {
      setTimeout(()=>{
        this.addclass = true;
      },1000)
    }
  }

  

  // Below function is use ro disabled link by checking installation mode 
  disabledLink(linkName){
    let className = '';
    switch(this.installationMode){
      case 'AP':
        if (linkName === 'System Setup' || linkName === 'Applications' || linkName === 'Deployment Verification' || linkName === 'Trend Analysis'){
          className = '';
        }else{
          className = 'disabled_menu';
        }
        break;
      case 'OES':
        if(linkName !== 'Deployment Verification'){
          className = '';
        }else{
          className = 'disabled_menu';
        }
        break;
      case 'OES-AP':
        className = '';
        break;
    }
    return className;
  }

  // Below function is use to return appropriate class for submenu link
  subMenuclass(link){
    const linkArr = link.split('/');
    let linkClass = linkArr[linkArr.length-1];
    return linkClass;
  }

  // Below function is returning css class active if current link is selected
  activeRoutes(linkName){
    const currentUrl = this.router.url;
    const selectedLink = currentUrl.split('/');
    const recivedLink = linkName.split('/');
    let returnClass = '';
    let subFactor = 0;

    // Below logic is use to deal with dynamic prams present in routes
    if(+selectedLink[selectedLink.length-1] > 0){
      subFactor = 3;
    }else{
      subFactor = 1;
    }

    if(recivedLink[recivedLink.length-1] === selectedLink[selectedLink.length-subFactor]){
      returnClass = 'active';
    }else{
      returnClass = '';
    }
    
    // Below logic is use to deal with setup links which is exception case
    if(linkName.includes('setup') && currentUrl.includes('setup')){
      returnClass = 'active';
    }
    return returnClass;
  }
  
}
